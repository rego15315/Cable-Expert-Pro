
import React, { useState } from 'react';
import { ArrowLeft, Scale, ShieldCheck, Search, Info, CheckCircle2, AlertTriangle, Coins, TrendingUp, HelpCircle, ShieldAlert, Zap, Layers, CircleDot, Type } from 'lucide-react';
import { useTranslation } from '../App';

export const AntiFakeCheck: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'value' | 'visual'>('value');
  const [size, setSize] = useState('2.5');
  const [length, setLength] = useState('100');
  const [copperPrice, setCopperPrice] = useState('9392'); 
  const [paidPrice, setPaidPrice] = useState('150'); 
  const [result, setResult] = useState<any>(null);

  const sizes = ['1.0', '1.5', '2.5', '4.0', '6.0', '10', '16', '25', '35', '50', '70', '95', '120'];

  const calculateValue = () => {
    const s = parseFloat(size);
    const l = parseFloat(length);
    const p = parseFloat(copperPrice);
    const retail = parseFloat(paidPrice);

    if (isNaN(s) || isNaN(l) || isNaN(p)) return;

    const weightKg = s * l * 8.96 * 0.001; 
    const rawValue = weightKg * (p / 1000); 

    let status: 'safe' | 'suspicious' | 'danger' = 'safe';
    const ratio = retail / rawValue;

    if (ratio < 1.1) status = 'danger';
    else if (ratio < 1.35) status = 'suspicious';
    else status = 'safe';

    setResult({
      weight: weightKg.toFixed(2),
      value: rawValue.toFixed(2),
      pricePerKg: (p / 1000).toFixed(2),
      status,
      ratio: ratio.toFixed(2)
    });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pt-4 pb-16">
      <div className="flex items-center space-x-3 px-1">
        <button onClick={onBack} className="p-2 bg-white shadow-sm border border-slate-100 rounded-full active:scale-90">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black text-slate-900">{t.verifyTitle}</h2>
      </div>

      <div className="flex bg-slate-200 p-1 rounded-2xl mx-1">
        <button onClick={() => setTab('value')} className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${tab === 'value' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>{t.weightCheck}</button>
        <button onClick={() => setTab('visual')} className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${tab === 'visual' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>{t.visualCheck}</button>
      </div>

      {tab === 'value' ? (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">{t.cableType}</label>
                <select 
                  value={size} 
                  onChange={e => setSize(e.target.value)} 
                  className="w-full bg-slate-50 p-4 rounded-2xl font-black text-slate-800 outline-none appearance-none border-2 border-transparent focus:border-blue-500 transition-all"
                >
                  {sizes.map(s => <option key={s} value={s}>{s} mm²</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">{t.length}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={length} 
                    onChange={e => setLength(e.target.value)} 
                    className="w-full bg-slate-50 p-4 rounded-2xl font-black text-slate-800 outline-none border-2 border-transparent focus:border-blue-500"
                  />
                  <span className="absolute right-4 top-4 font-black text-slate-300 uppercase text-[10px]">Meters</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">{t.marketPriceRef}</label>
                <div className="relative">
                  <div className="absolute left-3 top-4 text-emerald-500"><TrendingUp size={16} /></div>
                  <input 
                    type="number" 
                    value={copperPrice} 
                    onChange={e => setCopperPrice(e.target.value)} 
                    className="w-full bg-slate-50 p-4 pl-10 rounded-2xl font-bold text-slate-800 text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block tracking-widest">{t.retailPrice}</label>
                <div className="relative">
                  <div className="absolute left-3 top-4 text-blue-500"><Coins size={16} /></div>
                  <input 
                    type="number" 
                    value={paidPrice} 
                    onChange={e => setPaidPrice(e.target.value)} 
                    className="w-full bg-slate-50 p-4 pl-10 rounded-2xl font-bold text-slate-800 text-sm outline-none border-2 border-blue-100"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={calculateValue} 
              className="w-full py-5 bg-blue-600 text-white font-black rounded-[32px] shadow-xl active:scale-95 flex items-center justify-center space-x-2 transition-all hover:bg-blue-700"
            >
              <ShieldCheck size={20} />
              <span>{t.verifyBtn}</span>
            </button>
          </div>

          {result && (
            <div className="space-y-4 animate-in zoom-in duration-300">
              <div className={`p-8 rounded-[40px] shadow-2xl relative overflow-hidden transition-colors ${
                result.status === 'safe' ? 'bg-emerald-600' : 
                result.status === 'suspicious' ? 'bg-amber-500' : 'bg-red-600'
              } text-white`}>
                <div className="text-center relative z-10">
                  <div className="flex justify-center mb-4">
                     {result.status === 'safe' ? <CheckCircle2 size={48} /> : 
                      result.status === 'suspicious' ? <ShieldAlert size={48} /> : <AlertTriangle size={48} />}
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-[0.1em]">
                    {result.status === 'safe' ? t.safeStatus : 
                     result.status === 'suspicious' ? t.suspiciousStatus : t.dangerStatus}
                  </h3>
                  <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/20 pt-8">
                    <div>
                      <p className="text-[9px] text-white/60 font-black uppercase mb-1">{t.copperValue}</p>
                      <p className="text-2xl font-black">${result.value}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/60 font-black uppercase mb-1">Copper/Retail Ratio</p>
                      <p className="text-2xl font-black">{Math.round((1/result.ratio) * 100)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 px-1">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center mb-2">
              <Search size={16} className="mr-2 text-blue-600"/> {t.inspectionTitle}
            </h3>
            <div className="space-y-4">
              {[
                { title: t.copperColorTitle, desc: t.copperColorDesc, icon: Zap, color: 'bg-orange-100 text-orange-600' },
                { title: t.insulationTitle, desc: t.insulationDesc, icon: Layers, color: 'bg-blue-100 text-blue-600' },
                { title: t.concentricTitle, desc: t.concentricDesc, icon: CircleDot, color: 'bg-emerald-100 text-emerald-600' },
                { title: t.markingTitle, desc: t.markingDesc, icon: Type, color: 'bg-slate-100 text-slate-600' }
              ].map((item, idx) => (
                <div key={idx} className="flex space-x-4 p-5 bg-slate-50 rounded-[28px] border border-slate-100 transition-all hover:bg-white hover:shadow-md">
                  <div className={`mt-1 ${item.color} p-3 rounded-2xl h-fit`}>
                    <item.icon size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{item.title}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-2 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
