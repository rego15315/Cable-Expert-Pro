
import React, { useState, useEffect } from 'react';
// Fix: Added Activity to the imports from lucide-react to resolve the missing reference error on line 62
import { ArrowLeft, TrendingUp, TrendingDown, Globe, Clock, RefreshCcw, Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useTranslation } from '../App';

export const MarketBoard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchPrice = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/market/price');
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // 30秒自刷新同步一次
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pt-4 pb-16">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 bg-white shadow-sm border border-slate-100 rounded-full active:scale-90">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-black text-slate-900">{t.market}</h2>
        </div>
        <button onClick={fetchPrice} className={`p-2 rounded-full ${loading ? 'animate-spin' : ''}`}>
          <RefreshCcw size={18} className="text-slate-400" />
        </button>
      </div>

      <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        {data ? (
          <div className="relative z-10">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center">
              <Globe size={12} className="mr-2 text-blue-500"/> LME Spot Copper
            </p>
            <h3 className="text-5xl font-black mt-3">${data.price}</h3>
            
            <div className="h-48 mt-10 -mx-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.history}>
                  <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={0.2} fill="#3b82f6" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center"><Activity className="animate-pulse" /></div>
        )}
      </div>

      <div className="bg-blue-50/50 p-5 rounded-[24px] border border-blue-100">
         <p className="text-[11px] text-blue-900 font-bold">{t.marketNoteTitle}</p>
         <p className="text-[10px] text-blue-700 mt-1">{t.marketNoteDesc}</p>
      </div>
    </div>
  );
};
