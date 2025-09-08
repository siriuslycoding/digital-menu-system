// routes/chat.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const menuModel = require('../models/menuModel');

const HUGGING_FACE_TOKEN = process.env.HUGGINGFACE_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const EMBEDDING_API_URL = 'https://api-inference.huggingface.co/embeddings/sentence-transformers/all-MiniLM-L6-v2';

function preprocessForEmbedding(rawInput) {
  if (!rawInput || typeof rawInput !== "string") return "";

  // 1. Remove "User message:" label
  let cleaned = rawInput.replace(/User message:\s*/i, "");

  // 2. Replace "Preferences:" and list markers with commas
  cleaned = cleaned
    .replace(/Preferences:\s*/i, "")
    .replace(/-\s*/g, "")
    .replace(/\s+/g, " ") // collapse extra spaces/newlines
    .trim();

  // 3. Remove any "null" values
  cleaned = cleaned.replace(/\bnull\b/gi, "");

  // 4. Optionally: turn structured info into a single sentence
  return cleaned;
}

// Function to get embedding for a given text
async function getEmbedding(text) {
  console.log("Attempting to generate embedding with URL:", EMBEDDING_API_URL);
  console.log("Using Hugging Face Token (first 5 chars):", HUGGING_FACE_TOKEN ? HUGGING_FACE_TOKEN.substring(0, 5) : "Token is UNDEFINED");

  try {
    const response = await axios.post(
      EMBEDDING_API_URL,
      { inputs: text },
      { 
        headers: { 
          Authorization: `Bearer ${HUGGING_FACE_TOKEN}`,
          "Content-Type": "application/json"
        } 
      }
    );

    // const embedding = response.data;
    // if (Array.isArray(embedding) && Array.isArray(embedding[0])) {
    //   return embedding[0]; // flatten 2D array
    // }
    const embedding = response.data.embedding;
    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error.response?.data || error.message);
    return null;
  }
}

// Function to get a response from the LLM
async function getLlmResponse(query, context, preferences) {
  const prompt = `You are a friendly restaurant meal assistant. Your goal is to create a compelling combo suggestion based on the user's request and the provided menu items.

User's Preferences:
- Vibe: ${preferences.vibe || 'any'}
- Budget: Under ₹${preferences.budget}
- Vegetarian: ${preferences.vegOnly ? 'Must be vegetarian' : 'Not required'}
- Discounts: ${preferences.useDiscounts ? 'Prioritize items with discounts' : 'Not a priority'}

Context from menu (search results):
---
${context}
---

User's Original Question: "${query}"

Your Answer:`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      { headers: { Authorization: `Bearer ${GROQ_API_KEY}` } }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting LLM response:', error.response ? error.response.data : error.message);
    return 'Sorry, I encountered an error. Please try again.';
  }
}

// The main chat route
router.post('/', async (req, res) => {
  const { message, preferences } = req.body;
  const { budget, vibe, vegOnly, useDiscounts } = preferences;

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const detailedQuery = `
    User message: ${message}
    Preferences:
    - Vibe: ${vibe || 'any'}
    - Budget: up to ₹${budget}
    - Vegetarian only: ${vegOnly ? 'yes' : 'no'}
    - Consider discounts: ${useDiscounts ? 'yes' : 'no'}
  `;

  // 1. Generate embedding for the user's query
  const cleanedText = preprocessForEmbedding(detailedQuery);
  console.log("Request body:", { inputs: cleanedText});
  const queryEmbedding = await getEmbedding(cleanedText);
  console.log("Embedding length:", queryEmbedding.length);

  if (!queryEmbedding) {
    return res.status(500).json({ error: 'Failed to process query.' });
  }

  // 2. Perform vector search
  try {
    const results = await menuModel.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index', // IMPORTANT: Use the name of your Atlas Vector Search index
          path: 'item_embedding',
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 4,
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          description: 1,
          price: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]);

    if (results.length === 0) {
      return res.json({ response: "Sorry, I couldn't find anything on the menu that matches your question." });
    }

    // 3. Format the results and get LLM response
    const context = results
      .map(item => `Item: ${item.name}\nDescription: ${item.description}\nPrice: ${item.price} rupees`)
      .join('\n\n');

    const finalResponse = await getLlmResponse(message, context, preferences);
    res.json({
      reply: finalResponse,
      combos: [],
      suggestions: []
    });

  } catch (error) {
    console.error('Vector search error:', error);
    res.status(500).json({ error: 'Error searching the menu.' });
  }
});

module.exports = router;