
import React from 'react';
import { ShieldCheck, TrendingUp, Calculator, Zap, Bot, ChevronRight, Shield } from 'lucide-react';
import { useTranslation, LanguageContext } from '../App';
import { Language } from '../translations';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const miniChartData = [
  { p: 9200 }, { p: 9350 }, { p: 9280 }, { p: 9450 }, { p: 9392 }
];

interface AnalysisDashboardProps {
  onNavigate: (view: 'calc' | 'antifake' | 'market' | 'bill' | 'advisor') => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ onNavigate }) => {
  const { t, lang, setLang } = useTranslation();

  const hapticImpact = (style: 'light' | 'medium' = 'light') => {
    if ((window as any).Telegram?.WebApp?.HapticFeedback) {
      (window as any).Telegram.WebApp.HapticFeedback.impactOccurred(style);
    }
  };

  const handleLangChange = (l: Language) => {
    if (l === lang) return;
    setLang(l);
    hapticImpact('medium');
  };

  const flags: Record<Language, string> = {
    cn: '🇨🇳',
    en: '🇺🇸',
    kh: '🇰🇭'
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <header className="pt-6 flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.appName}</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">IEC Standard Toolkit</p>
        </div>
        
        {/* Language Selector in Top Right */}
        <div className="flex bg-white/80 backdrop-blur-md shadow-sm border border-slate-100 p-1 rounded-2xl">
          {(['cn', 'en', 'kh'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => handleLangChange(l)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
                lang === l 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-105 z-10' 
                : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              <span className="text-xl leading-none">{flags[l]}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Live Market */}
      <section 
        onClick={() => { hapticImpact(); onNavigate('market'); }}
        className="bg-slate-900 rounded-[40px] p-7 text-white shadow-2xl relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center">
                <TrendingUp size={12} className="mr-1.5 text-emerald-400" /> {t.copperPrice}
              </p>
              <h3 className="text-4xl font-black tracking-tighter">$9,392.50</h3>
              <p className="text-emerald-400 text-[11px] font-bold">+1.24% <span className="text-slate-500 ml-1 font-medium">LME 24H</span></p>
            </div>
            <div className="w-24 h-12 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniChartData}>
                  <Area type="monotone" dataKey="p" stroke="#10b981" fill="transparent" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <TrendingUp size={140} />
        </div>
      </section>

      {/* Safety Tips Block */}
      <section 
        onClick={() => { hapticImpact(); onNavigate('advisor'); }}
        className="bg-white rounded-[32px] p-6 border-2 border-blue-50 shadow-xl shadow-blue-100/20 relative overflow-hidden transition-all cursor-pointer active:scale-[0.98]"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-200">
              <Shield size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-black text-slate-800 text-sm">{t.proTipsTitle}</h4>
                <span className="bg-blue-100 text-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Pro</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{t.proTipsDesc}</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-200" />
        </div>
        <div className="absolute -bottom-6 -right-6 opacity-[0.03] rotate-12">
          <Bot size={120} />
        </div>
      </section>

      {/* Quick Access Tiles */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Professional Suite</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => { hapticImpact(); onNavigate('calc'); }}
            className="flex flex-col items-start p-6 bg-white rounded-[32px] shadow-sm border border-slate-100 active:scale-95 transition-all text-left space-y-4 hover:border-blue-100"
          >
            <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl"><Calculator size={24}/></div>
            <div>
               <p className="font-black text-slate-800 text-sm leading-tight">{t.sizing}</p>
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">IEC Standards</p>
            </div>
          </button>

          <button 
            onClick={() => { hapticImpact(); onNavigate('antifake'); }}
            className="flex flex-col items-start p-6 bg-white rounded-[32px] shadow-sm border border-slate-100 active:scale-95 transition-all text-left space-y-4 hover:border-emerald-100"
          >
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl"><ShieldCheck size={24}/></div>
            <div>
               <p className="font-black text-slate-800 text-sm leading-tight">{t.antiFake}</p>
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Audit Tool</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
