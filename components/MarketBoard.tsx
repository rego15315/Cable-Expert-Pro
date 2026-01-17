import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Globe, RefreshCcw, Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useTranslation } from '../App';

export const MarketBoard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'1h' | '1d' | '1m'>('1h');

  const fetchPrice = async (range: string = timeRange) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/market/price?range=${range}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice(timeRange);
  }, [timeRange]);
  
  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pt-4 pb-16 px-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 bg-white shadow-sm border border-slate-100 rounded-full active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-black text-slate-900">{t.market}</h2>
        </div>
        <button onClick={() => fetchPrice()} className={`p-2 rounded-full ${loading ? 'animate-spin' : ''}`}>
          <RefreshCcw size={18} className="text-slate-400" />
        </button>
      </div>

      <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden transition-all">
        <div className="relative z-20 flex justify-between items-start mb-6">
           <div className="space-y-1">
             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center">
               <Globe size={12} className="mr-2 text-blue-500"/> Real-time LME Copper
             </p>
             <h3 className="text-5xl font-black mt-2">
               {data ? `$${data.price}` : '---'}
             </h3>
           </div>
           
           <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-md">
             {(['1h', '1d', '1m'] as const).map((r) => (
               <button
                 key={r}
                 onClick={() => setTimeRange(r)}
                 className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                   timeRange === r ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                 }`}
               >
                 {r}
               </button>
             ))}
           </div>
        </div>

        {data && data.history ? (
          <div className="h-56 relative z-10 -mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.history}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
                  itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  strokeWidth={4} 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-56 flex flex-col items-center justify-center space-y-3">
            <Activity className="animate-pulse text-blue-500" size={32} />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loading Live Data...</p>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-start space-x-4">
         <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
           <TrendingUp size={20} />
         </div>
         <div>
            <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-1">{t.marketNoteTitle}</p>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{t.marketNoteDesc}</p>
         </div>
      </div>
    </div>
  );
};
