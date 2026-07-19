import React from 'react';
import { 
  CalendarDays, 
  Sun, 
  CloudRain, 
  CloudLightning, 
  CloudSun, 
  Wind, 
  ArrowUp, 
  ArrowDown, 
  Compass, 
  Sparkles,
  Droplet
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ForecastDay, ForecastHour, WeatherInfo } from '../types';

interface ForecastViewProps {
  weeklyForecast: ForecastDay[];
  hourlyForecast: ForecastHour[];
  weather: WeatherInfo;
}

export default function ForecastView({ weeklyForecast, hourlyForecast, weather }: ForecastViewProps) {
  
  const getWeatherIcon = (code: string, size = "w-8 h-8") => {
    switch (code) {
      case 'sunny':
        return <Sun className={`${size} text-yellow-400`} />;
      case 'rainy':
        return <CloudRain className={`${size} text-blue-400`} />;
      case 'storm':
        return <CloudLightning className={`${size} text-purple-400`} />;
      case 'cloudy':
      default:
        return <CloudSun className={`${size} text-slate-300`} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Weather Prognosis Engine</h2>
          <p className="text-sm text-slate-400 mt-1">Multi-model forecast projections for rain, thermal fluctuations, and soil watering safety</p>
        </div>
      </div>

      {/* Main Grid: Forecast Details & 7-Day Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 7-Day Forecast Apple-weather-like list */}
        <div className="lg:col-span-2 rounded-3xl bg-slate-900/40 border border-slate-800/60 p-6 backdrop-blur-xl shadow-xl shadow-slate-950/10 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4" /> 7-Day Macroclimate Outlook
          </h3>

          <div className="space-y-3.5">
            {weeklyForecast.map((day, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/15 border border-slate-800/30 hover:bg-slate-800/30 transition-all duration-150"
              >
                {/* Day name */}
                <span className="text-sm font-bold text-slate-200 w-24 truncate">{day.day}</span>
                
                {/* Weather Code with icon */}
                <div className="flex items-center gap-2.5 w-32">
                  {getWeatherIcon(day.conditionCode, "w-6 h-6")}
                  <span className="text-xs font-semibold text-slate-300 truncate">{day.condition}</span>
                </div>

                {/* Rain Probability indicator */}
                <span className="text-xs font-semibold font-mono text-cyan-400 flex items-center gap-1 w-16 justify-center">
                  <CloudRain className="w-3.5 h-3.5" /> {day.rainProb}%
                </span>

                {/* Temperature High-Low slider bars */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-500 font-bold">{day.tempMin}°</span>
                  <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute h-full rounded-full bg-gradient-to-r from-cyan-400 to-amber-400" 
                      style={{ left: '20%', right: '15%' }}
                    />
                  </div>
                  <span className="text-white font-bold">{day.tempMax}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast interactive sidebar cards - Rain Forecast & Wind direction */}
        <div className="space-y-6 flex flex-col">
          
          {/* Rain Prediction micro gauges */}
          <div className="rounded-3xl bg-slate-900/40 border border-slate-800/60 p-5 backdrop-blur-xl shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-3">
                <CloudRain className="w-4 h-4 text-cyan-400 animate-bounce" /> Rain Prediction Probability
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Probability threshold of severe downpour is currently at <span className="text-cyan-400 font-bold">{weather.rainProb}%</span>. Optimal condition for open cultivation fields.
              </p>
            </div>

            <div className="space-y-3 mt-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Downpour Chance</span>
                  <span className="text-cyan-400">{weather.rainProb}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${weather.rainProb}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Soil Runoff Risk</span>
                  <span className="text-emerald-400">Low (12%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Wind direction card */}
          <div className="rounded-3xl bg-slate-900/40 border border-slate-800/60 p-5 backdrop-blur-xl shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-3">
                <Wind className="w-4 h-4 text-cyan-400" /> Wind & Drift Forecast
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Wind velocity averages <span className="text-slate-200 font-semibold">{weather.windSpeed} km/h</span>. Wind drift limits are fully safe for chemical spraying or greenhouse shutter venting.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4 bg-slate-950/30 p-2.5 border border-slate-800/40 rounded-xl">
              <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg text-white">
                <Compass className="w-5 h-5 animate-[spin_8s_linear_infinite]" />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Direction Vector</span>
                <span className="text-xs font-bold text-slate-200 block mt-0.5">North-Northwest (324° NNW)</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Hourly Pre-precipitation Area Chart */}
      <div className="rounded-3xl bg-slate-900/40 border border-slate-800/60 p-6 backdrop-blur-xl shadow-xl shadow-slate-950/10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-cyan-400" /> Rain and Temperature Prediction Trend Curve
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyForecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="rainProb" name="Rain Prob %" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRain)" />
              <Area type="monotone" dataKey="temp" name="Temp °C" stroke="#f59e0b" strokeWidth={1.5} fillOpacity={1} fill="url(#colorTemp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
