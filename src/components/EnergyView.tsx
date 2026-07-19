import React, { useState } from 'react';
import { 
  BatteryCharging, 
  Sun, 
  Zap, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { EnergyData } from '../types';

interface EnergyViewProps {
  energy: EnergyData;
}

export default function EnergyView({ energy }: EnergyViewProps) {
  const [energyPeriod, setEnergyPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Realistic mock data periods for rendering rich agricultural smart grids
  const getPeriodData = () => {
    switch (energyPeriod) {
      case 'weekly':
        return [
          { time: 'Mon', solar: 24.5, battery: 80, consumption: 10.2 },
          { time: 'Tue', solar: 28.2, battery: 82, consumption: 11.4 },
          { time: 'Wed', solar: 15.6, battery: 74, consumption: 13.8 },
          { time: 'Thu', solar: 32.1, battery: 89, consumption: 11.2 },
          { time: 'Fri', solar: 36.4, battery: 94, consumption: 10.8 },
          { time: 'Sat', solar: 18.2, battery: 81, consumption: 12.5 },
          { time: 'Sun', solar: 38.8, battery: 96, consumption: 9.6 },
        ];
      case 'monthly':
        return [
          { time: 'Week 1', solar: 180, battery: 85, consumption: 74 },
          { time: 'Week 2', solar: 220, battery: 89, consumption: 78 },
          { time: 'Week 3', solar: 140, battery: 72, consumption: 89 },
          { time: 'Week 4', solar: 240, battery: 92, consumption: 71 },
        ];
      case 'daily':
      default:
        return energy.history;
    }
  };

  const getMetricMultiplier = () => {
    switch (energyPeriod) {
      case 'weekly': return 7;
      case 'monthly': return 30;
      case 'daily':
      default: return 1;
    }
  };

  const currentMultiplier = getMetricMultiplier();
  const solarSum = (energy.solarGeneration * 6.5 * currentMultiplier).toFixed(1);
  const consumptionSum = (energy.powerConsumption * 24 * currentMultiplier).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Eco-Energy Smart Grid</h2>
          <p className="text-sm text-slate-400 mt-1">Solar generation telemetry and battery bank charge tracking</p>
        </div>

        {/* Period selection tabs */}
        <div className="flex items-center bg-slate-900/60 p-1 border border-slate-800/60 rounded-xl self-start">
          {(['daily', 'weekly', 'monthly'] as const).map((period) => (
            <button
              id={`energy-period-${period}-btn`}
              key={period}
              onClick={() => setEnergyPeriod(period)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide capitalize transition-all duration-150 cursor-pointer ${
                energyPeriod === period 
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700/50' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Grid: Power statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Solar Generation */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl shadow-lg flex items-center justify-between group">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Solar Power Gen</span>
            <span className="text-2xl font-black text-white mt-1.5 block">
              {energy.solarGeneration.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW (Live)</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Total: {solarSum} kWh
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-yellow-500/10 text-yellow-400 group-hover:scale-105 transition-transform">
            <Sun className="w-7 h-7" />
          </div>
        </div>

        {/* Battery Capacity */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl shadow-lg flex items-center justify-between group">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Storage Bank</span>
            <span className="text-2xl font-black text-emerald-400 mt-1.5 block">
              {energy.batteryPercentage}% <span className="text-xs font-normal text-slate-400">Capacity</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" /> State: Discharging
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
            <BatteryCharging className="w-7 h-7" />
          </div>
        </div>

        {/* Power Consumption */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl shadow-lg flex items-center justify-between group">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Consumption Load</span>
            <span className="text-2xl font-black text-white mt-1.5 block">
              {energy.powerConsumption.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW (Live)</span>
            </span>
            <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1 mt-1">
              <ArrowDownRight className="w-3.5 h-3.5" /> Load: {consumptionSum} kWh
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 group-hover:scale-105 transition-transform">
            <Zap className="w-7 h-7" />
          </div>
        </div>

      </div>

      {/* Visual Energy Comparison Area Chart */}
      <div className="rounded-3xl bg-slate-900/40 border border-slate-800/60 p-6 backdrop-blur-xl shadow-xl shadow-slate-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" /> Gen-Load Balancing curves ({energyPeriod.toUpperCase()})
          </h3>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 text-yellow-400">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> Solar Output
            </span>
            <span className="inline-flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Operational Load
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getPeriodData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="solar" name="Solar Gen (kW)" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSolar)" />
              <Area type="monotone" dataKey="consumption" name="Load Load (kW)" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorConsumption)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
