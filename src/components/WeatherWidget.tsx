import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  CloudLightning, 
  Wind, 
  Droplet, 
  Compass, 
  Navigation,
  Sparkles,
  CalendarDays,
  Clock,
  ArrowUp,
  ArrowDown,
  Gauge
} from 'lucide-react';
import { WeatherInfo, ForecastHour, SensorData } from '../types';

interface WeatherWidgetProps {
  weather: WeatherInfo;
  hourlyForecast: ForecastHour[];
  sensors: SensorData[];
  onFetchLatest: () => void;
  isLoading: boolean;
}

export default function WeatherWidget({
  weather,
  hourlyForecast,
  sensors,
  onFetchLatest,
  isLoading
}: WeatherWidgetProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine weather animations or icons based on conditionCode
  const renderWeatherIcon = (code: string, size = "w-16 h-16") => {
    switch (code) {
      case 'sunny':
        return (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
            <Sun className={`${size} text-yellow-400 animate-[spin_12s_linear_infinite]`} />
          </div>
        );
      case 'rainy':
        return (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-blue-400/20 rounded-full blur-xl animate-pulse" />
            <CloudRain className={`${size} text-blue-400 animate-bounce`} />
          </div>
        );
      case 'storm':
        return (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
            <CloudLightning className={`${size} text-purple-400 animate-[pulse_1s_infinite]`} />
          </div>
        );
      case 'cloudy':
      default:
        return (
          <div className="relative flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-sky-300/10 rounded-full blur-xl animate-pulse" />
            <CloudSun className={`${size} text-slate-300 animate-[pulse_2.5s_infinite]`} />
          </div>
        );
    }
  };

  // Quick statistics calculation
  const airTempSensor = sensors.find(s => s.id === 'temp');
  const soilMoistSensor = sensors.find(s => s.id === 'soil');
  const lightSensor = sensors.find(s => s.id === 'light');

  return (
    <div className="space-y-6">
      {/* Upper Grid - Primary Weather Card and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Apple Weather Glassmorphic main Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-slate-900/40 border border-slate-800/60 p-6 backdrop-blur-xl shadow-xl shadow-slate-950/20 flex flex-col justify-between min-h-[300px]">
          {/* Subtle background gradient glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Card Top: Location, Time & Sync */}
          <div className="flex justify-between items-start z-10">
            <div>
              <div className="flex items-center gap-2 text-slate-400">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold tracking-wider uppercase">{weather.location}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">Metropolitan Grid</h2>
            </div>
            
            <div className="text-right flex flex-col items-end">
              <button 
                id="fetch-latest-weather-btn"
                onClick={onFetchLatest}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 rounded-xl text-xs font-medium text-slate-200 transition-all cursor-pointer hover:border-slate-600 mb-2 disabled:opacity-50"
              >
                <Clock className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
                {isLoading ? 'Syncing...' : 'Sync Station'}
              </button>
              <div className="text-xs font-mono text-cyan-400 tracking-wider">
                {currentTime || 'Loading clock...'}
              </div>
            </div>
          </div>

          {/* Card Middle: Temperature Display */}
          <div className="flex items-end justify-between my-6 z-10">
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-extrabold tracking-tighter text-white">
                {weather.temp.toFixed(1)}
              </span>
              <span className="text-3xl font-light text-slate-300">°C</span>
            </div>
            <div className="flex flex-col items-end">
              {renderWeatherIcon(weather.conditionCode, "w-20 h-20")}
              <p className="text-lg font-semibold text-slate-200 mt-2">{weather.condition}</p>
            </div>
          </div>

          {/* Card Bottom: Core Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/40 pt-4 z-10 text-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Humidity</span>
              <span className="text-base font-semibold text-white mt-0.5 inline-flex items-center gap-1">
                <Droplet className="w-4 h-4 text-blue-400" /> {weather.humidity}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Wind Force</span>
              <span className="text-base font-semibold text-white mt-0.5 inline-flex items-center gap-1">
                <Wind className="w-4 h-4 text-cyan-400" /> {weather.windSpeed} km/h
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Precipitation</span>
              <span className="text-base font-semibold text-white mt-0.5 inline-flex items-center gap-1">
                <CloudRain className="w-4 h-4 text-indigo-400" /> {weather.rainProb}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Pressure</span>
              <span className="text-base font-semibold text-white mt-0.5 inline-flex items-center gap-1">
                <Gauge className="w-4 h-4 text-purple-400" /> {weather.pressure} hPa
              </span>
            </div>
          </div>
        </div>

        {/* Weather Summary Card & Key Crop Indicators */}
        <div className="rounded-3xl bg-slate-900/40 border border-slate-800/60 p-6 backdrop-blur-xl flex flex-col justify-between shadow-xl shadow-slate-950/20">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4" /> Live Crop Summary
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Greenhouse atmosphere is currently <span className="text-cyan-300 font-medium">optimally stable</span>. 
              The air temperature is {airTempSensor ? `${airTempSensor.value}°C` : 'stable'} with low wind drift risks. 
              However, <span className="text-amber-400 font-medium">soil moisture is extremely depleted ({soilMoistSensor ? `${soilMoistSensor.value}%` : 'low'})</span>, requiring active micro-watering protocols.
            </p>
          </div>

          <div className="space-y-3 mt-6 border-t border-slate-800/40 pt-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">UV Exposure Index</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md font-semibold font-mono">
                {weather.uvIndex} (Low-Mid)
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Air Quality Index (AQI)</span>
              <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-md font-semibold font-mono">
                {weather.aqi} - Excellent
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Daily Sun Window</span>
              <span className="text-slate-200 font-medium font-mono">
                {weather.sunrise} - {weather.sunset}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Timeline - Sliding glass list of today's weather patterns */}
      <div className="rounded-3xl bg-slate-900/40 border border-slate-800/60 p-6 backdrop-blur-xl shadow-xl shadow-slate-950/20">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
          <CalendarDays className="w-4 h-4 text-cyan-400" /> Today's 24-Hour Microclimate Path
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {hourlyForecast.map((hour, idx) => (
            <div 
              key={idx} 
              className="flex-shrink-0 w-20 py-4 px-2 rounded-2xl bg-slate-950/20 border border-slate-800/30 flex flex-col items-center justify-between gap-2 hover:bg-slate-800/30 transition-all duration-200"
            >
              <span className="text-xs font-semibold text-slate-400">{hour.time}</span>
              {renderWeatherIcon(hour.conditionCode, "w-8 h-8")}
              <span className="text-sm font-bold text-white">{hour.temp}°</span>
              <span className="text-[10px] font-medium text-cyan-400">{hour.rainProb}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Statistics Mini Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/40 backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Ambient Heat</span>
            <span className="text-xl font-bold text-slate-100 mt-1 block">
              {airTempSensor ? `${airTempSensor.value} ${airTempSensor.unit}` : 'Loading...'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400">
            <Sun className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/40 backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Soil Moisture</span>
            <span className="text-xl font-bold text-amber-500 mt-1 block">
              {soilMoistSensor ? `${soilMoistSensor.value} ${soilMoistSensor.unit}` : 'Loading...'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Droplet className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/30 border border-slate-800/40 backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">Sun Intensity</span>
            <span className="text-xl font-bold text-slate-100 mt-1 block">
              {lightSensor ? `${lightSensor.value} ${lightSensor.unit}` : 'Loading...'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400">
            <Sun className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
