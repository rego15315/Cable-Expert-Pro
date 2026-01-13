
import React from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Globe, Info, Clock } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useTranslation } from '../App';

const mockData = [
  { time: '08:00', price: 9240 },
  { time: '10:00', price: 9310 },
  { time: '12:00', price: 9280 },
  { time: '14:00', price: 9350 },
  { time: '16:00', price: 9410 },
  { time: '18:00', price: 9392 },
];

export const MarketBoard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pt-4 pb-16">
      <div className="flex items-center space-x-3 px-1">
        <button onClick={onBack} className="p-2 bg-white shadow-sm border border-slate-100 rounded-full active:scale-90">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black text-slate-900">{t.market}</h2>
      </div>

      {/* Global Price Header */}
      <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center">
                <Globe size={12} className="mr-2 text-blue-500"/> LME Spot Copper
              </p>
              <h3 className="text-5xl font-black mt-3">$9,392.50</h3>
              <p className="text-slate-500 text-[10px] font-bold mt-2 uppercase tracking-widest">{t.marketUnit}</p>
            </div>
            <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-2xl flex items-center text-sm font-black border border-emerald-500/30">
              <TrendingUp size={16} className="mr-1.5"/> +1.2%
            </div>
          </div>
          
          <div className="h-48 mt-10 -mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase mt-4 tracking-widest">
             <span className="flex items-center"><Clock size={10} className="mr-1"/> Updated: Real-time</span>
             <span>Market: LME London</span>
          </div>
        </div>
      </div>

      {/* Local Markets */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SHFE Main (CNY/mt)</p>
          <div className="flex items-baseline space-x-1 py-1">
            <p className="text-2xl font-black text-slate-800">74,210</p>
          </div>
          <div className="flex items-center text-[10px] text-red-500 font-bold">
            <TrendingDown size={14} className="mr-1" /> -0.42%
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">USD/CNY Rate</p>
          <p className="text-2xl font-black text-slate-800 py-1">7.2415</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Fixed Mid-Rate</p>
        </div>
      </div>

      <div className="bg-blue-50/50 p-5 rounded-[24px] flex items-start space-x-3 border border-blue-100">
        <Info size={18} className="text-blue-600 mt-1 shrink-0" />
        <div className="space-y-1">
           <p className="text-[11px] text-blue-900 leading-relaxed font-bold">
             {t.marketNoteTitle}
           </p>
           <p className="text-[10px] text-blue-700 leading-relaxed opacity-80">
             {t.marketNoteDesc}
           </p>
        </div>
      </div>
    </div>
  );
};
