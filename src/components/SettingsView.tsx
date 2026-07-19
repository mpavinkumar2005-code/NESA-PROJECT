import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Sun, 
  Moon, 
  Globe, 
  Database, 
  Cpu, 
  Key, 
  LogOut, 
  CheckCircle2 
} from 'lucide-react';

interface SettingsViewProps {
  onLogout: () => void;
  userEmail?: string;
  theme: 'light' | 'dark';
  onChangeTheme: (theme: 'light' | 'dark') => void;
}

export default function SettingsView({ onLogout, userEmail, theme, onChangeTheme }: SettingsViewProps) {
  const [profileName, setProfileName] = useState<string>('John Farmer');
  const [locationName, setLocationName] = useState<string>('Greenhouse Zone A, CA');
  const [notifications, setNotifications] = useState({
    storms: true,
    soilWarning: true,
    batteryAlert: false,
    deviceState: true,
  });
  const [language, setLanguage] = useState<string>('en');
  
  // Custom user secrets/API key states saved in localStorage
  const [openWeatherKey, setOpenWeatherKey] = useState<string>(() => localStorage.getItem('VITE_OPENWEATHER_KEY') || '');
  const [customFirestoreUri, setCustomFirestoreUri] = useState<string>(() => localStorage.getItem('VITE_CUSTOM_FIRESTORE_URI') || '');
  const [customGeminiKey, setCustomGeminiKey] = useState<string>(() => localStorage.getItem('VITE_CUSTOM_GEMINI_KEY') || '');

  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleSaveSecrets = () => {
    localStorage.setItem('VITE_OPENWEATHER_KEY', openWeatherKey);
    localStorage.setItem('VITE_CUSTOM_FIRESTORE_URI', customFirestoreUri);
    localStorage.setItem('VITE_CUSTOM_GEMINI_KEY', customGeminiKey);
    
    setSaveSuccess('API configuration keys and secrets persisted locally.');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Configuration & Settings</h2>
          <p className="text-sm text-slate-400 mt-1">Manage greenhouse identity, notification rules, theme styles, and cloud API keys</p>
        </div>
      </div>

      {saveSuccess && (
        <div id="settings-alert-success" className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs font-semibold text-emerald-400 animate-slide-in">
          <CheckCircle2 className="w-4 h-4 animate-bounce" /> {saveSuccess}
        </div>
      )}

      {/* Grid: Settings Submodules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Profile Card & System Theme */}
        <div className="rounded-3xl bg-slate-900/40 border border-slate-800/60 p-6 backdrop-blur-xl shadow-xl shadow-slate-950/10 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
            <User className="w-4 h-4" /> Agri-Operator Profile
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1.5">User Identity Email</label>
              <input
                type="text"
                value={userEmail || 'kannanvaithi425@gmail.com'}
                disabled
                className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-xs font-medium text-slate-500 font-mono focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1.5">Operator Name</label>
                <input
                  id="profile-name-input"
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1.5">Geographic Location</label>
                <input
                  id="profile-location-input"
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Theme & Language selector */}
          <div className="border-t border-slate-800/40 pt-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" /> Interface & Display Aesthetics
            </h4>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-300 block">Theme Palette Mode</span>
                <span className="text-[10px] text-slate-500">Toggle dark glassmorphism styling presets</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 border border-slate-800 rounded-xl">
                <button
                  id="theme-light-btn"
                  onClick={() => onChangeTheme('light')}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    theme === 'light' 
                      ? 'bg-slate-800 text-yellow-400 shadow-md' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  id="theme-dark-btn"
                  onClick={() => onChangeTheme('dark')}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-slate-800 text-cyan-400 shadow-md' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-300 block">System Language</span>
                <span className="text-[10px] text-slate-500 font-medium">Default locale settings</span>
              </div>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="en">English (US)</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications rules & API Key Management */}
        <div className="rounded-3xl bg-slate-900/40 border border-slate-800/60 p-6 backdrop-blur-xl shadow-xl shadow-slate-950/10 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
            <Bell className="w-4 h-4" /> Real-time Alert Decoders
          </h3>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-300 block">Meteorological Storm Alerts</span>
                <span className="text-[10px] text-slate-500">Warnings on lightning, storms and high winds</span>
              </div>
              <input
                id="toggle-notification-storms"
                type="checkbox"
                checked={notifications.storms}
                onChange={(e) => setNotifications({ ...notifications, storms: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-300 block">Agronomic Soil & Hydration Alarms</span>
                <span className="text-[10px] text-slate-500">Alerts when soil moisture dips below safe 30% thresholds</span>
              </div>
              <input
                id="toggle-notification-soil"
                type="checkbox"
                checked={notifications.soilWarning}
                onChange={(e) => setNotifications({ ...notifications, soilWarning: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-300 block">Battery Depletion Alarms</span>
                <span className="text-[10px] text-slate-500">Warnings on solar battery grids declining past 20%</span>
              </div>
              <input
                id="toggle-notification-battery"
                type="checkbox"
                checked={notifications.batteryAlert}
                onChange={(e) => setNotifications({ ...notifications, batteryAlert: e.target.checked })}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Secure secrets credentials input */}
          <div className="border-t border-slate-800/40 pt-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400 animate-pulse" /> Advanced Keys & Secrets (Local Only)
            </h4>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">OpenWeatherMap API Token</label>
                <input
                  id="openweather-key-input"
                  type="password"
                  value={openWeatherKey}
                  onChange={(e) => setOpenWeatherKey(e.target.value)}
                  placeholder="e.g. 52a1b9c3f4e..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs font-medium text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Custom Firestore DB Host URI</label>
                <input
                  id="firestore-uri-input"
                  type="text"
                  value={customFirestoreUri}
                  onChange={(e) => setCustomFirestoreUri(e.target.value)}
                  placeholder="e.g. cloud.google.com/firestore/..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs font-medium text-white font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  id="save-secrets-btn"
                  onClick={handleSaveSecrets}
                  className="flex-1 py-3 bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 rounded-xl text-xs font-bold text-cyan-400 hover:text-white transition-all cursor-pointer"
                >
                  Persist Keys
                </button>
                <button
                  id="settings-logout-btn"
                  onClick={onLogout}
                  className="px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
