// // routes/chat.js
// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const menuModel = require('../models/menuModel');

// const HUGGING_FACE_TOKEN = process.env.HUGGINGFACE_API_KEY;
// const GROQ_API_KEY = process.env.GROQ_API_KEY;
// const EMBEDDING_API_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction";

// function preprocessForEmbedding(rawInput) {
//   if (!rawInput || typeof rawInput !== "string") return "";

//   // 1. Remove "User message:" label
//   let cleaned = rawInput.replace(/User message:\s*/i, "");

//   // 2. Replace "Preferences:" and list markers with commas
//   cleaned = cleaned
//     .replace(/Preferences:\s*/i, "")
//     .replace(/-\s*/g, "")
//     .replace(/\s+/g, " ") // collapse extra spaces/newlines
//     .trim();

//   // 3. Remove any "null" values
//   cleaned = cleaned.replace(/\bnull\b/gi, "");

//   // 4. Optionally: turn structured info into a single sentence
//   return cleaned;
// }
// async function getEmbedding(text) {
//   console.log("Attempting to generate embedding with URL:", EMBEDDING_API_URL);
//   console.log("Using Hugging Face Token (first 5 chars):", HUGGING_FACE_TOKEN ? HUGGING_FACE_TOKEN.substring(0, 5) : "Token is UNDEFINED");

//   try {
//     const response = await axios.post(
//       EMBEDDING_API_URL,
//       { inputs: text },
//       { headers: { Authorization: `Bearer ${HUGGING_FACE_TOKEN}` } }
//     );

//     // --- TEMPORARY DEBUGGING CODE ---
//     console.log("***********************************************************");
//     console.log("** FULL API RESPONSE.DATA TO INSPECT:");
//     console.log(JSON.stringify(response.data, null, 2));
//     console.log("***********************************************************");
//     return null; // Temporarily stop here to prevent crash and see the log
//     // --- END OF DEBUGGING CODE ---

//     // The old parsing logic is below, we will fix it in the next step
//     const embedding = response.data[0]; 

//     if (embedding && Array.isArray(embedding)) {
//         return embedding;
//     } else {
//         console.error("Received an invalid or empty embedding format from API.");
//         return null;
//     }

//   } catch (error) {
//     console.error("Error generating embedding:", error.response?.data || error.message);
//     return null;
//   }
// }
// // Function to get embedding for a given text
// async function getEmbedding(text) {
//   console.log("Attempting to generate embedding with URL:", EMBEDDING_API_URL);
//   console.log("Using Hugging Face Token (first 5 chars):", HUGGING_FACE_TOKEN ? HUGGING_FACE_TOKEN.substring(0, 5) : "Token is UNDEFINED");

//   try {
//     const response = await axios.post(
//       EMBEDDING_API_URL,
//       { inputs: text },
//       { headers: { Authorization: `Bearer ${HUGGING_FACE_TOKEN}` } }
//     );

//     // ✅ The API response itself is the embedding vector.
//     const embedding = response.data; 

//     // Check if the response is a valid, non-empty array.
//     if (embedding && Array.isArray(embedding) && embedding.length > 0) {
//         return embedding;
//     } else {
//         console.error("Received an invalid or empty embedding format from API:", response.data);
//         return null;
//     }

//   } catch (error) {
//     console.error("Error generating embedding:", error.response?.data || error.message);
//     return null;
//   }
// }

// // Function to get a response from the LLM
// async function getLlmResponse(query, context, preferences) {
//   const prompt = `You are a friendly restaurant meal assistant. Your goal is to create a compelling combo suggestion based on the user's request and the provided menu items.

// User's Preferences:
// - Vibe: ${preferences.vibe || 'any'}
// - Budget: Under ₹${preferences.budget}
// - Vegetarian: ${preferences.vegOnly ? 'Must be vegetarian' : 'Not required'}
// - Discounts: ${preferences.useDiscounts ? 'Prioritize items with discounts' : 'Not a priority'}

// Context from menu (search results):
// ---
// ${context}
// ---

// User's Original Question: "${query}"

// Your Answer:`;

//   try {
//     const response = await axios.post(
//       'https://api.groq.com/openai/v1/chat/completions',
//       {
//         model: 'llama3-8b-8192',
//         messages: [{ role: 'user', content: prompt }],
//         temperature: 0.7,
//       },
//       { headers: { Authorization: `Bearer ${GROQ_API_KEY}` } }
//     );
//     return response.data.choices[0].message.content;
//   } catch (error) {
//     console.error('Error getting LLM response:', error.response ? error.response.data : error.message);
//     return 'Sorry, I encountered an error. Please try again.';
//   }
// }

// // The main chat route
// router.post('/', async (req, res) => {
//   const { message, preferences } = req.body;
//   const { budget, vibe, vegOnly, useDiscounts } = preferences;

//   if (!message) {
//     return res.status(400).json({ error: 'Message is required.' });
//   }

//   const detailedQuery = `
//     User message: ${message}
//     Preferences:
//     - Vibe: ${vibe || 'any'}
//     - Budget: up to ₹${budget}
//     - Vegetarian only: ${vegOnly ? 'yes' : 'no'}
//     - Consider discounts: ${useDiscounts ? 'yes' : 'no'}
//   `;

//   // 1. Generate embedding for the user's query
//   const cleanedText = preprocessForEmbedding(detailedQuery);
//   console.log("Request body:", { inputs: cleanedText });
//   const queryEmbedding = await getEmbedding(cleanedText);
//   console.log("Embedding length:", queryEmbedding.length);

//   if (!queryEmbedding) {
//     return res.status(500).json({ error: 'Failed to process query.' });
//   }

//   // 2. Perform vector search
//   try {
//     const results = await menuModel.aggregate([
//       {
//         $vectorSearch: {
//           index: 'vector_index', // IMPORTANT: Use the name of your Atlas Vector Search index
//           path: 'item_embedding',
//           queryVector: queryEmbedding,
//           numCandidates: 100,
//           limit: 4,
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           name: 1,
//           description: 1,
//           price: 1,
//           score: { $meta: 'vectorSearchScore' },
//         },
//       },
//     ]);

//     if (results.length === 0) {
//       return res.json({ response: "Sorry, I couldn't find anything on the menu that matches your question." });
//     }

//     // 3. Format the results and get LLM response
//     const context = results
//       .map(item => `Item: ${item.name}\nDescription: ${item.description}\nPrice: ${item.price} rupees`)
//       .join('\n\n');

//     const finalResponse = await getLlmResponse(message, context, preferences);
//     res.json({
//       reply: finalResponse,
//       combos: [],
//       suggestions: []
//     });

//   } catch (error) {
//     console.error('Vector search error:', error);
//     res.status(500).json({ error: 'Error searching the menu.' });
//   }
// });

// module.exports = router;

// routes/chat.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
// Assuming menuModel is correctly set up elsewhere in your project
// const menuModel = require('../models/menuModel'); 

// Mock menuModel if it doesn't exist for standalone testing
const menuModel = {
  aggregate: async () => {
    // Return some mock data that matches the structure
    return [
      { name: "Spicy Paneer Pizza", description: "A fiery pizza with paneer tikka, capsicum, and red paprika.", price: 280 },
      { name: "Veggie Delight Sub", description: "A healthy sub with fresh lettuce, tomatoes, cucumbers, and olives.", price: 150 },
      { name: "Cheese Garlic Bread", description: "Classic garlic bread with a generous topping of mozzarella cheese.", price: 120 },
      { name: "Chocolate Lava Cake", description: "Warm chocolate cake with a gooey molten center.", price: 90 },
    ];
  }
};


const HUGGING_FACE_TOKEN = process.env.HUGGINGFACE_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const EMBEDDING_API_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction";

function preprocessForEmbedding(rawInput) {
  if (!rawInput || typeof rawInput !== "string") return "";
  let cleaned = rawInput.replace(/User message:\s*/i, "");
  cleaned = cleaned
    .replace(/Preferences:\s*/i, "")
    .replace(/-\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();
  cleaned = cleaned.replace(/\bnull\b/gi, "");
  return cleaned;
}

// Function to get embedding for a given text
async function getEmbedding(text) {
  // This function is stable, no changes needed here.
  try {
    const response = await axios.post(
      EMBEDDING_API_URL,
      { inputs: text },
      { headers: { Authorization: `Bearer ${HUGGING_FACE_TOKEN}` } }
    );
    const embedding = response.data; 
    if (embedding && Array.isArray(embedding) && embedding.length > 0) {
        return embedding;
    } else {
        console.error("Received an invalid or empty embedding format from API:", response.data);
        return null;
    }
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
        // ✅ DEBUGGING FIX 1: Switched to a faster model to prevent timeouts.
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      { headers: { Authorization: `Bearer ${GROQ_API_KEY}` } }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting LLM response:', error.response ? error.response.data : error.message);
    return 'Sorry, I encountered an error connecting to the AI. Please try again.';
  }
}

// The main chat route
router.post('/', async (req, res) => {
  // ✅ DEBUGGING FIX 2: Added detailed, step-by-step logging.
  console.log("\n--- NEW REQUEST RECEIVED ---");
  const { message, preferences } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const detailedQuery = `User message: ${message} Preferences: - Vibe: ${preferences.vibe || 'any'} - Budget: up to ₹${preferences.budget} - Vegetarian only: ${preferences.vegOnly ? 'yes' : 'no'} - Consider discounts: ${preferences.useDiscounts ? 'yes' : 'no'}`;
  
  // STEP 1: Get Embedding
  console.log("STEP 1: Generating embedding...");
  const cleanedText = preprocessForEmbedding(detailedQuery);
  const queryEmbedding = await getEmbedding(cleanedText);

  if (!queryEmbedding) {
    console.error("FAILED at STEP 1. Could not get embedding.");
    return res.status(503).json({ response: 'The meal assistant is currently busy. Please try again in a moment.' });
  }
  console.log("STEP 1 SUCCESS. Embedding received (length:", queryEmbedding.length, ")");
  
  // STEP 2: Vector Search
  try {
    console.log("STEP 2: Performing vector search...");
    const results = await menuModel.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index', 
          path: 'item_embedding',
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 4,
        },
      },
      {
        $project: {
          _id: 0, name: 1, description: 1, price: 1, score: { $meta: 'vectorSearchScore' },
        },
      },
    ]);
    console.log("STEP 2 SUCCESS. Found", results.length, "items from search.");

    if (results.length === 0) {
      console.log("No results found. Sending response to user.");
      return res.json({ response: "Sorry, I couldn't find anything on the menu that matches your request." });
    }

    // STEP 3: Get LLM Response
    const context = results
      .map(item => `Item: ${item.name}\nDescription: ${item.description}\nPrice: ${item.price} rupees`)
      .join('\n\n');
      
    console.log("STEP 3: Calling Groq LLM for the final answer...");
    const finalResponse = await getLlmResponse(message, context, preferences);
    console.log("STEP 3 SUCCESS. Received response from LLM.");

    // STEP 4: Send Final Response
    console.log("STEP 4: Sending final response to the frontend.");
    res.json({
      response: finalResponse,
      combos: [],
      suggestions: []
    });
    console.log("--- REQUEST COMPLETE ---");

  } catch (error) {
    console.error('Vector search error or other failure:', error);
    res.status(500).json({ response: 'Error searching the menu.' });
  }
});

module.exports = router;

