import React, { useState } from 'react';
import { 
  Activity, 
  Layers, 
  Wind, 
  RefreshCw, 
  Lightbulb, 
  Maximize2, 
  CloudRain, 
  Power, 
  Clock, 
  Zap,
  RotateCw,
  Sliders,
  X,
  Plus
} from 'lucide-react';
import { SmartDevice } from '../types';

interface ControlViewProps {
  devices: SmartDevice[];
  onToggleDevice: (id: string) => void;
  onChangeDeviceMode: (id: string, mode: 'AUTO' | 'MANUAL') => void;
  onUpdateSchedule: (id: string, schedule: string | null) => void;
}

export default function ControlView({ 
  devices, 
  onToggleDevice, 
  onChangeDeviceMode,
  onUpdateSchedule 
}: ControlViewProps) {
  const [selectedDevice, setSelectedDevice] = useState<SmartDevice | null>(null);
  const [newSchedule, setNewSchedule] = useState<string>('');

  // Selector for lucide icons dynamically
  const getDeviceIcon = (id: string, isON: boolean) => {
    const activeColor = isON ? 'animate-pulse' : '';
    switch (id) {
      case 'water-pump':
        return <Activity className={`w-6 h-6 ${activeColor}`} />;
      case 'irrigation':
        return <Layers className={`w-6 h-6 ${activeColor}`} />;
      case 'cooling-fan':
        return <Wind className={`w-6 h-6 ${isON ? 'animate-spin' : ''}`} />;
      case 'exhaust-fan':
        return <RefreshCw className={`w-6 h-6 ${isON ? 'animate-spin' : ''}`} />;
      case 'grow-light':
        return <Lightbulb className={`w-6 h-6 ${activeColor}`} />;
      case 'window-controller':
        return <Maximize2 className={`w-6 h-6 ${activeColor}`} />;
      case 'misting':
        return <CloudRain className={`w-6 h-6 ${activeColor}`} />;
      default:
        return <Power className={`w-6 h-6 ${activeColor}`} />;
    }
  };

  const getThemeColorClass = (colorName: string) => {
    switch (colorName) {
      case 'blue': return 'from-blue-500 to-indigo-600 shadow-blue-500/20 text-blue-400 border-blue-500/30';
      case 'emerald': return 'from-emerald-500 to-teal-600 shadow-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'cyan': return 'from-cyan-400 to-blue-500 shadow-cyan-500/20 text-cyan-400 border-cyan-400/30';
      case 'teal': return 'from-teal-400 to-emerald-600 shadow-teal-500/20 text-teal-400 border-teal-500/30';
      case 'yellow': return 'from-yellow-400 to-amber-500 shadow-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'purple': return 'from-purple-500 to-violet-600 shadow-purple-500/20 text-purple-400 border-purple-500/30';
      case 'indigo': return 'from-indigo-500 to-blue-600 shadow-indigo-500/20 text-indigo-400 border-indigo-500/30';
      default: return 'from-slate-500 to-slate-700 shadow-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const handleSaveSchedule = () => {
    if (selectedDevice) {
      onUpdateSchedule(selectedDevice.id, newSchedule === '' ? null : newSchedule);
      setSelectedDevice(null);
      setNewSchedule('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Dynamic Smart Control Hub</h2>
          <p className="text-sm text-slate-400 mt-1">Regulate and automate essential systems manually or via AI-powered routines</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/60 p-1 border border-slate-800/60 rounded-xl max-w-xs self-start">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 shadow-sm">
            <Sliders className="w-3.5 h-3.5" /> Core Systems
          </div>
        </div>
      </div>

      {/* Grid of Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.map((device) => {
          const isON = device.status === 'ON';
          const isAuto = device.mode === 'AUTO';
          const themeColor = getThemeColorClass(device.color);

          return (
            <div 
              id={`device-card-${device.id}`}
              key={device.id}
              className={`rounded-2xl border bg-slate-900/40 p-5 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden group hover:translate-y-[-2px] ${
                isON 
                  ? `border-slate-800/80 shadow-lg shadow-slate-950/20` 
                  : 'border-slate-800/40'
              }`}
            >
              {/* Glow backdrops */}
              {isON && (
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${themeColor.split(' ')[0]} to-transparent rounded-full blur-2xl opacity-20 pointer-events-none`} />
              )}

              {/* Upper Section: Icon & Toggle Mode */}
              <div className="flex items-start justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl bg-slate-950/40 border ${isON ? themeColor.split(' ')[3] : 'border-slate-800/50'} flex items-center justify-center transition-all duration-300 ${
                    isON ? 'shadow-inner' : ''
                  }`}>
                    <span className={isON ? themeColor.split(' ')[2] : 'text-slate-500'}>
                      {getDeviceIcon(device.id, isON)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
                      {device.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isON ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                        {device.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Auto / Manual controller pills */}
                <div className="flex items-center bg-slate-950/65 rounded-xl p-0.5 border border-slate-800/50">
                  <button
                    id={`device-${device.id}-mode-auto-btn`}
                    onClick={() => onChangeDeviceMode(device.id, 'AUTO')}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all duration-150 cursor-pointer ${
                      isAuto 
                        ? 'bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Auto
                  </button>
                  <button
                    id={`device-${device.id}-mode-manual-btn`}
                    onClick={() => onChangeDeviceMode(device.id, 'MANUAL')}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-all duration-150 cursor-pointer ${
                      !isAuto 
                        ? 'bg-slate-800 text-slate-200 border border-slate-700/50' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Man
                  </button>
                </div>
              </div>

              {/* Status information & Automation description */}
              <div className="my-5 space-y-1.5 z-10 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Automation Logic:</span>
                  <span className={`font-mono text-[10px] font-semibold ${isAuto ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {device.automationRule || 'None (Manual Override)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled:</span>
                  <span className="font-mono text-[10px] text-slate-300 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> {device.schedule || 'Continuous'}
                  </span>
                </div>
              </div>

              {/* Bottom Row - Toggle Switch & Options */}
              <div className="flex items-center justify-between border-t border-slate-800/40 pt-4 z-10">
                <button
                  id={`schedule-device-${device.id}-btn`}
                  onClick={() => {
                    setSelectedDevice(device);
                    setNewSchedule(device.schedule || '');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/20 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-slate-800/50 hover:border-slate-700 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" /> Program
                </button>

                {/* Animated Toggle Switch */}
                <button
                  id={`toggle-device-${device.id}-btn`}
                  onClick={() => {
                    if (isAuto) {
                      // Warn or shift to manual mode
                      onChangeDeviceMode(device.id, 'MANUAL');
                    }
                    onToggleDevice(device.id);
                  }}
                  className={`relative w-12 h-6 rounded-full p-0.5 transition-all duration-300 cursor-pointer focus:outline-none ${
                    isON 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow shadow-cyan-500/20' 
                      : 'bg-slate-950 border border-slate-800'
                  }`}
                >
                  {/* Sliding circle */}
                  <div 
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                      isON ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  >
                    <Power className={`w-3.5 h-3.5 ${isON ? 'text-cyan-500 font-bold' : 'text-slate-400'}`} />
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Program Schedule Dialog Modal Overlay */}
      {selectedDevice && (
        <div id="schedule-dialog-overlay" className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative">
            <button 
              id="close-schedule-dialog-btn"
              onClick={() => setSelectedDevice(null)} 
              className="absolute top-4 right-4 p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-cyan-400 animate-pulse" /> Schedule {selectedDevice.name}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Specify active operational windows using clear hourly intervals (e.g., <code className="bg-slate-950 px-1 py-0.5 rounded font-mono text-cyan-400">06:00 AM - 08:00 AM</code>). Enter empty string to disable scheduling.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1.5">Active Time Interval</label>
                <input
                  id="schedule-time-input"
                  type="text"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  placeholder="e.g. 06:00 AM - 08:00 AM"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  id="cancel-schedule-btn"
                  onClick={() => setSelectedDevice(null)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700/80 rounded-xl text-xs font-bold text-slate-300 transition-all cursor-pointer"
                >
                  Discard
                </button>
                <button
                  id="save-schedule-btn"
                  onClick={handleSaveSchedule}
                  className="flex-1 py-3 bg-gradient-to-tr from-cyan-500 to-blue-600 hover:opacity-90 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-lg shadow-cyan-500/15"
                >
                  Save Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
