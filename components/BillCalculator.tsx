
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, Activity, Coins, Clock, TrendingUp, Info, DollarSign } from 'lucide-react';
import { useTranslation } from '../App';

export const BillCalculator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useTranslation();
  const [power, setPower] = useState('2.5'); 
  const [hours, setHours] = useState('8'); 
  const [price, setPrice] = useState('0.15'); 
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const p = parseFloat(power);
    const h = parseFloat(hours);
    const pr = parseFloat(price);

    // Fix: Corrected iNaN to isNaN
    if (isNaN(p) || isNaN(h) || isNaN(pr)) return;

    const dailyKwh = p * h;
    const daily = dailyKwh * pr;
    const monthly = daily * 30;
    const yearly = daily * 365;

    setResults({
      dailyKwh: dailyKwh.toFixed(2),
      daily: daily.toFixed(2),
      monthly: monthly.toFixed(2),
      yearly: yearly.toFixed(2)
    });
  }, [power, hours, price]);

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pt-4 pb-16 px-1">
      <div className="flex items-center space-x-3">
        <button onClick={onBack} className="p-2 bg-white shadow-sm border border-slate-100 rounded-full active:scale-90">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black text-slate-900">{t.billCalc}</h2>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">{t.loadPower}</label>
            <div className="relative">
              <input 
                type="number" 
                value={power} 
                onChange={e => setPower(e.target.value)} 
                className="w-full text-4xl font-black bg-slate-50 rounded-2xl p-5 border-2 border-transparent focus:border-blue-500 outline-none transition-all" 
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-sm">KW</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
               <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block tracking-wider">{t.usageTime}</label>
               <div className="flex items-center space-x-2">
                 <Clock size={16} className="text-blue-500" />
                 <input 
                  type="number" 
                  value={hours} 
                  onChange={e => setHours(e.target.value)}
                  className="w-full bg-transparent font-black text-slate-800 text-lg outline-none"
                 />
               </div>
             </div>
             <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
               <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block tracking-wider">{t.elecPrice}</label>
               <div className="flex items-center space-x-2">
                 <Coins size={16} className="text-emerald-500" />
                 <input 
                  type="number" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)}
                  className="w-full bg-transparent font-black text-slate-800 text-lg outline-none"
                 />
               </div>
             </div>
          </div>
        </div>
      </div>

      {results && (
        <div className="space-y-4 animate-in zoom-in-95 duration-500">
           <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10 text-center">
                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">{t.monthlyCost}</p>
                 <h3 className="text-6xl font-black mt-4 flex items-baseline justify-center">
                    <span className="text-2xl text-blue-500 mr-1">$</span>{results.monthly}
                 </h3>
                 <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{results.dailyKwh} kWh / Day Average</p>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Activity size={100} />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.dailyCost}</p>
                 <p className="text-2xl font-black text-slate-800">${results.daily}</p>
              </div>
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.yearlyCost}</p>
                 <p className="text-2xl font-black text-slate-800">${results.yearly}</p>
              </div>
           </div>

           <div className="bg-blue-50/50 p-6 rounded-[32px] border border-blue-100 flex items-start space-x-3">
              <Info size={18} className="text-blue-600 mt-0.5 shrink-0" />
              <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
                {t.billNote}
              </p>
           </div>
        </div>
      )}
    </div>
  );
};
