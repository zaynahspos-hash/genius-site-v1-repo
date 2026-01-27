import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { getShoppingAssistantResponse } from '../../services/geminiService';
import { productService } from '../../services/productService';

export const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Hi! I\'m your ShopGenius assistant. Looking for something special today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [catalogSummary, setCatalogSummary] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch a quick summary of the catalog for AI context
    productService.getProducts({ limit: 20 }).then(data => {
      const summary = data.products.map((p: any) => `${p.title} ($${p.price})`).join(', ');
      setCatalogSummary(summary);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const botResponse = await getShoppingAssistantResponse(userText, catalogSummary);
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageSquare size={24} className="relative z-10" />
          <div className="absolute -top-1 -right-1">
             <Sparkles size={12} className="text-yellow-400 animate-pulse" />
          </div>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 w-[350px] sm:w-[400px] h-[550px] rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden ring-1 ring-black/5">
          {/* Header */}
          <div className="p-4 bg-black text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Shopping Assistant</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-gray-300 font-medium uppercase tracking-widest">Always Active</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none text-gray-500">
                  <Loader2 size={16} className="animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about products, styles..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1.5 p-2 bg-black text-white rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-30"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-center text-gray-400 mt-2">Powered by ShopGenius AI Intelligence</p>
          </form>
        </div>
      )}
    </div>
  );
};
