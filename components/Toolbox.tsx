
import React from 'react';
import { Calculator, ShieldCheck, TrendingUp, Info, Zap, Layers, Beaker, Wallet } from 'lucide-react';
import { useTranslation } from '../App';

interface ToolboxProps {
  onNavigate: (view: 'calc' | 'antifake' | 'market' | 'bill') => void;
}

export const Toolbox: React.FC<ToolboxProps> = ({ onNavigate }) => {
  const { t } = useTranslation();

  const tools = [
    { id: 'calc', name: t.sizing, sub: t.sizingSub, icon: Calculator, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'bill', name: t.billCalc, sub: t.billSub, icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'antifake', name: t.antiFake, sub: t.antiFakeSub, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'market', name: t.market, sub: t.marketSub, icon: TrendingUp, color: 'text-slate-700', bg: 'bg-slate-100' },
  ];

  const futureTools = [
    { name: 'Conduit Sizing', icon: Zap },
    { name: 'Voltage Drop Pro', icon: Layers },
    { name: 'Resistance Test', icon: Beaker },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <header className="pt-6">
        <h2 className="text-2xl font-black text-slate-900">{t.toolbox}</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Select an operation</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {tools.map(tool => (
          <button 
            key={tool.id}
            onClick={() => onNavigate(tool.id as any)}
            className="flex items-center space-x-4 p-5 bg-white rounded-[32px] shadow-sm border border-slate-100 active:scale-95 transition-all hover:border-blue-100 hover:shadow-md"
          >
            <div className={`${tool.bg} ${tool.color} p-4 rounded-2xl`}>
              <tool.icon size={28} />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-800">{tool.name}</p>
              <p className="text-[10px] text-slate-400 font-medium">{tool.sub}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="pt-4 space-y-4">
         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{t.comingSoon}</h3>
         <div className="grid grid-cols-2 gap-3 px-1">
            {futureTools.map(f => (
              <div key={f.name} className="p-4 bg-slate-50 rounded-[28px] border border-dashed border-slate-200 opacity-60 flex flex-col items-center text-center space-y-2">
                 <f.icon size={20} className="text-slate-300" />
                 <span className="text-[10px] font-bold text-slate-400">{f.name}</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};
