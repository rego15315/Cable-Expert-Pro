
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User, Sparkles, Activity, Shield } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useTranslation } from '../App';

export const AIAdvisor: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t, lang } = useTranslation();
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    // Haptic feedback for TWA - Use any cast to fix Telegram type error
    if ((window as any).Telegram?.WebApp?.HapticFeedback) {
      (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are WireExpert Pro AI Advisor. Expert in IEC 60364, local electrical codes, and cable manufacturing. Answer technical questions concisely in ${lang === 'cn' ? 'Chinese' : lang === 'kh' ? 'Khmer' : 'English'}. Keep safety as top priority. Use professional engineering terminology.`,
          temperature: 0.7,
        }
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || 'Error processing request.' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: 'I am having trouble connecting. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] animate-in slide-in-from-right duration-300">
      <div className="flex items-center space-x-3 p-4 bg-white/50 backdrop-blur-lg border-b border-slate-100 shrink-0">
        <button onClick={onBack} className="p-2 bg-white shadow-sm border border-slate-100 rounded-full active:scale-90">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center space-x-2">
           <div className="bg-blue-600 p-2 rounded-xl text-white"><Bot size={18}/></div>
           <h2 className="text-lg font-black text-slate-900">{t.aiAdvisor}</h2>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-20 space-y-4 opacity-40">
            <Sparkles size={48} className="mx-auto text-blue-500" />
            <p className="text-sm font-bold uppercase tracking-[0.2em]">{lang === 'cn' ? '准备好提供技术方案' : 'Ready to provide solutions'}</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm font-medium ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center space-x-2">
                <Activity size={16} className="text-blue-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thinking...</span>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 shrink-0 mb-4 rounded-[32px] mx-2 shadow-2xl">
         <div className="flex items-center space-x-2">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={t.aiPrompt}
              className="flex-1 bg-slate-50 p-4 rounded-2xl text-sm outline-none font-medium border-2 border-transparent focus:border-blue-200 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="p-4 bg-blue-600 text-white rounded-2xl active:scale-90 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
         </div>
         <div className="flex justify-center items-center mt-3 space-x-1.5 opacity-40">
            <Shield size={10} />
            <p className="text-[9px] font-bold uppercase tracking-widest">{t.aiDisclaimer}</p>
         </div>
      </div>
    </div>
  );
};
