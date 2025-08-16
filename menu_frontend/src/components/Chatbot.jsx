import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Send, Sparkles, X, Loader2 } from 'lucide-react';

const VIBE_OPTIONS = [
  { key: 'romantic', label: 'Romantic' },
  { key: 'party', label: 'Party' },
  { key: 'cozy', label: 'Cozy' },
  { key: 'healthy', label: 'Healthy' },
];


export default function ChatBot() {
  const [open, setOpen] = useState(false);               // drawer open on first visit; make false for FAB pattern
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I can create tasty combos under your budget. Tell me a vibe (romantic/party/cozy/healthy) and a budget—I'll suggest options with discounts & chef availability 👩‍🍳✨" }
  ]);
  const [input, setInput] = useState('');
  const [vibe, setVibe] = useState('null');
  const [budget, setBudget] = useState(500);
  const [vegOnly, setVegOnly] = useState(false);
  const [useDiscounts, setUseDiscounts] = useState(true);
  const [loading, setLoading] = useState(false);

  const listRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const sendMessage = async (text) => {
    const userMsg = text ?? input.trim();
    if (!userMsg) return;

    // optimistic update
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // POST to your backend orchestrator (we’ll write it later)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          preferences: {
            budget,
            vibe,
            vegOnly,
            useDiscounts
          }
        })
      });

      if (!res.ok) {
        // Handle common “backend not ready” case gracefully
        const fallback = "I’m having trouble reaching the kitchen right now. Try again in a moment!";
        setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
        return;
      }

      // Expected shape (we’ll return this from backend):
      // { reply: string, combos?: Array<Combo>, suggestions?: string[] }
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.reply, combos: data.combos || [], suggestions: data.suggestions || [] }
      ]);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Network hiccup! Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAsk = (text) => {
    sendMessage(text);
  };

  return (
    <>
    
      {/* Floating Action Button (if you want it closed by default) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 rounded-full p-4 bg-[#6B4F4F] text-[#F8E6C1] shadow-lg"
          aria-label="Open assistant"
        >
          <Sparkles />
        </button>
      )}

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          {/* Blur/Dim background */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full h-[85vh] sm:h-[80vh] sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl
                          bg-gradient-to-b from-[#3b2b2b] to-[#94614e] text-[#F8E6C1]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#6B4F4F]">
              <div className="flex items-center gap-2">
                <Sparkles className="opacity-90" />
                <h3 className="font-semibold">Meal Assistant</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-white/10"
              >
                <X />
              </button>
            </div>

            {/* Preferences / Filters */}
            <div className="px-4 py-3 space-y-3 bg-white/5">
              {/* Vibe */}
              <div>
                <p className="text-sm opacity-90 mb-1">Vibe</p>
                <div className="flex gap-2 flex-wrap">
                  {VIBE_OPTIONS.map(v => (
                    <button
                      key={v.key}
                      onClick={() => setVibe(v.key)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition
                        ${vibe === v.key ? 'bg-[#D9A066] text-white border-[#D9A066]' : 'border-white/20 hover:bg-white/10'}`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm opacity-90">Budget (₹)</p>
                  <span className="font-semibold">₹{budget}</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={1500}
                  step={50}
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  className="w-full accent-[#D9A066]"
                />
                <div className="flex justify-between text-xs mt-1 opacity-80">
                  <span>₹100</span><span>₹1500</span>
                </div>
              </div>

              {/* Flags */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={vegOnly}
                    onChange={e => setVegOnly(e.target.checked)}
                    className="accent-[#D9A066]"
                  />
                  Veg only
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={useDiscounts}
                    onChange={e => setUseDiscounts(e.target.checked)}
                    className="accent-[#D9A066]"
                  />
                  Use discounts
                </label>
              </div>
            </div>

            {/* Messages */}
            <div ref={listRef} className="px-4 py-3 space-y-3 h-[calc(85vh-240px)] sm:h-[calc(80vh-240px)] overflow-y-auto">
              {messages.map((m, idx) => (
                <Message key={idx} m={m} />
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <Loader2 className="animate-spin" />
                  Thinking…
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="px-4 pb-2">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                <QuickBtn text="Under ₹300 snacks" onClick={handleQuickAsk} />
                <QuickBtn text="Romantic dinner for 2" onClick={handleQuickAsk} />
                <QuickBtn text="Party platters under ₹800" onClick={handleQuickAsk} />
                <QuickBtn text="New launches this week" onClick={handleQuickAsk} />
              </div>
            </div>

            {/* Input */}
            <div className="px-3 py-2 bg-[#6B4F4F] border-t border-white/10">
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 px-3 py-2 rounded-xl bg-white text-black placeholder-gray-500"
                  placeholder="Ask for combos…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && canSend) sendMessage();
                  }}
                />
                <button
                  disabled={!canSend}
                  onClick={() => sendMessage()}
                  className="p-2 rounded-xl bg-[#D9A066] text-white disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[11px] opacity-80 mt-1">
                I’ll factor in vibe, budget, chef availability, discounts, and new launches.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
    
  );
}

function Message({ m }) {
  const isUser = m.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow
        ${isUser ? 'bg-white text-black' : 'bg-white/10 text-[#F8E6C1]'}`}
      >
        <p className={`${isUser ? 'text-gray-800' : 'text-[#F8E6C1] whitespace-pre-wrap'}`}>
          {m.content}
        </p>

        {/* Combos (if provided by backend) */}
        {Array.isArray(m.combos) && m.combos.length > 0 && (
          <div className="mt-2 grid gap-2">
            {m.combos.map((c) => (
              <ComboCard key={c.id || `${c.name}-${c.price}`} combo={c} />
            ))}
          </div>
        )}

        {/* Follow-up suggestions */}
        {Array.isArray(m.suggestions) && m.suggestions.length > 0 && (
          <ul className="mt-2 list-disc list-inside opacity-90">
            {m.suggestions.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}

function ComboCard({ combo }) {
  // combo: { name, items: [{name}], price, chefName, available, discountPct, isNew }
  return (
    <div className="rounded-xl border border-white/10 bg-black/10 px-3 py-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{combo.name || 'Combo'}</h4>
        <div className="text-sm font-bold">₹{combo.price}</div>
      </div>
      {combo.items?.length ? (
        <p className="text-xs opacity-90 mt-0.5">
          {combo.items.map(i => i.name).join(' • ')}
        </p>
      ) : null}
      <div className="flex gap-2 mt-2 flex-wrap">
        {combo.chefName && (
          <span className="text-[11px] rounded-full px-2 py-0.5 bg-white/10">
            👩‍🍳 {combo.chefName}
          </span>
        )}
        {combo.available === false && (
          <span className="text-[11px] rounded-full px-2 py-0.5 bg-red-500/20">
            Unavailable
          </span>
        )}
        {typeof combo.discountPct === 'number' && combo.discountPct > 0 && (
          <span className="text-[11px] rounded-full px-2 py-0.5 bg-green-600/30">
            {combo.discountPct}% off
          </span>
        )}
        {combo.isNew && (
          <span className="text-[11px] rounded-full px-2 py-0.5 bg-yellow-500/30">
            New
          </span>
        )}
      </div>
    </div>
  );
}

function QuickBtn({ text, onClick }) {
  return (
    <button
      onClick={() => onClick(text)}
      className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-sm border border-white/10"
    >
      {text}
    </button>
  );
}
