import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Sprout, 
  Sun, 
  Wind, 
  CloudRain, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  History
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { SensorData } from '../types';

interface SensorsViewProps {
  sensors: SensorData[];
  onForceSensorRead: (id: string) => void;
}

export default function SensorsView({ sensors, onForceSensorRead }: SensorsViewProps) {
  
  // Icon selector map
  const getIconComponent = (iconName: string, colorClass: string) => {
    switch (iconName) {
      case 'Thermometer':
        return <Thermometer className={`w-5 h-5 ${colorClass}`} />;
      case 'Droplets':
        return <Droplets className={`w-5 h-5 ${colorClass}`} />;
      case 'Sprout':
        return <Sprout className={`w-5 h-5 ${colorClass}`} />;
      case 'Sun':
        return <Sun className={`w-5 h-5 ${colorClass}`} />;
      case 'Wind':
        return <Wind className={`w-5 h-5 ${colorClass}`} />;
      case 'CloudRain':
        return <CloudRain className={`w-5 h-5 ${colorClass}`} />;
      default:
        return <Activity className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  const getStatusBadge = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3" /> Critical
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3" /> Warning
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
            <CheckCircle className="w-3 h-3" /> Normal
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Environmental Sensor Matrix</h2>
          <p className="text-sm text-slate-400 mt-1">Live telemetry streaming directly from solar-powered IoT micro-nodes</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/40 px-4 py-2 rounded-xl border border-slate-800/60 backdrop-blur-md">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-300 font-mono">Stream: ACTIVE</span>
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sensors.map((sensor) => {
          const isWarning = sensor.status !== 'normal';
          return (
            <div 
              key={sensor.id}
              className={`relative overflow-hidden rounded-2xl bg-slate-900/40 border backdrop-blur-xl p-5 shadow-lg flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px] hover:shadow-cyan-950/10 ${
                isWarning 
                  ? 'border-amber-500/30 shadow-amber-950/5' 
                  : 'border-slate-800/60 shadow-slate-950/10'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${sensor.color} bg-opacity-20 flex items-center justify-center shadow-inner`}>
                    {getIconComponent(sensor.icon, "text-white")}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">{sensor.name}</h3>
                    <span className="text-[10px] text-slate-500 font-medium font-mono">ID: {sensor.id.toUpperCase()}-STATION</span>
                  </div>
                </div>
                {getStatusBadge(sensor.status)}
              </div>

              {/* Sensor Reading */}
              <div className="my-5 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-white tracking-tight">
                    {sensor.value.toFixed(1)}
                  </span>
                  <span className="text-base font-medium text-slate-400 ml-1">
                    {sensor.unit}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Target Window</span>
                  <span className="text-xs font-semibold text-slate-300 font-mono mt-0.5 block">
                    {sensor.minRange} - {sensor.maxRange} {sensor.unit}
                  </span>
                </div>
              </div>

              {/* Sparkline Graph */}
              <div className="h-16 w-full my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sensor.history}>
                    <Tooltip 
                      contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                      itemStyle={{ color: '#22d3ee', fontSize: '11px', padding: '0px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={sensor.id === 'soil' ? '#d97706' : '#06b6d4'} 
                      strokeWidth={2} 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-800/40 pt-3.5 mt-2 text-[10px]">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <History className="w-3.5 h-3.5" />
                  <span>Updated: {sensor.lastUpdated}</span>
                </div>
                <button
                  id={`refresh-sensor-${sensor.id}-btn`}
                  onClick={() => onForceSensorRead(sensor.id)}
                  className="px-2.5 py-1 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/40 hover:border-slate-600 rounded-lg font-bold text-cyan-400 tracking-wide uppercase transition-all duration-200 cursor-pointer"
                >
                  Poll Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
