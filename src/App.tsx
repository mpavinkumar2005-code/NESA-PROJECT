/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X,
  User
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import WeatherWidget from './components/WeatherWidget';
import SensorsView from './components/SensorsView';
import ControlView from './components/ControlView';
import ForecastView from './components/ForecastView';
import AiInsightsView from './components/AiInsightsView';
import EnergyView from './components/EnergyView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import AuthView from './components/AuthView';
import PlantHealthView from './components/PlantHealthView';

import { 
  initialSensors, 
  initialDevices, 
  defaultWeather, 
  defaultHourlyForecast, 
  defaultWeeklyForecast, 
  initialEnergy, 
  initialNotifications, 
  initialRecommendations 
} from './data/mockData';

import { SensorData, SmartDevice, WeatherInfo, NotificationItem, AIRecommendation } from './types';

export default function App() {
  // Session Authentication State
  const [userEmail, setUserEmail] = useState<string | null>(() => sessionStorage.getItem('VITE_SESSION_OPERATOR'));

  // App Layout States
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Core Systems States
  const [sensors, setSensors] = useState<SensorData[]>(initialSensors);
  const [devices, setDevices] = useState<SmartDevice[]>(initialDevices);
  const [weather, setWeather] = useState<WeatherInfo>(defaultWeather);
  const [energy, setEnergy] = useState(initialEnergy);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(initialRecommendations);

  // Loading States
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [isAnalyzingAi, setIsAnalyzingAi] = useState<boolean>(false);

  // Sync session on mount/change
  useEffect(() => {
    if (userEmail) {
      sessionStorage.setItem('VITE_SESSION_OPERATOR', userEmail);
    } else {
      sessionStorage.removeItem('VITE_SESSION_OPERATOR');
    }
  }, [userEmail]);

  // Synchronize HTML dark mode styling
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#020617'; // slate-950
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8fafc'; // slate-50
    }
  }, [theme]);

  const handleAuthSuccess = (email: string) => {
    setUserEmail(email);
    // Auto-prepend login success alarm
    const newAlert: NotificationItem = {
      id: `n-${Date.now()}`,
      title: 'Operator Authenticated',
      message: `Secure control session established for ${email}. Telemetry initialized.`,
      type: 'success',
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newAlert, ...prev]);
  };

  const handleLogout = () => {
    setUserEmail(null);
    setActiveTab('dashboard');
  };

  // 1. Toggles physical device ON/OFF status
  const handleToggleDevice = (id: string) => {
    setDevices(prev => prev.map(dev => {
      if (dev.id === id) {
        const nextStatus = dev.status === 'ON' ? 'OFF' : 'ON';
        
        // Push telemetry alert for device state change
        const alertItem: NotificationItem = {
          id: `n-${Date.now()}`,
          title: `Device Toggled`,
          message: `${dev.name} successfully switched ${nextStatus}.`,
          type: nextStatus === 'ON' ? 'success' : 'info',
          time: 'Just now',
          read: false
        };
        setNotifications(alerts => [alertItem, ...alerts]);

        return {
          ...dev,
          status: nextStatus,
          lastToggled: 'Just now'
        };
      }
      return dev;
    }));
  };

  // 2. Swaps device operating mode between AUTO and MANUAL
  const handleChangeDeviceMode = (id: string, mode: 'AUTO' | 'MANUAL') => {
    setDevices(prev => prev.map(dev => {
      if (dev.id === id) {
        return { ...dev, mode };
      }
      return dev;
    }));
  };

  // 3. Updates active operational schedule
  const handleUpdateSchedule = (id: string, schedule: string | null) => {
    setDevices(prev => prev.map(dev => {
      if (dev.id === id) {
        return { ...dev, schedule };
      }
      return dev;
    }));
  };

  // 4. Force poll fresh reading from individual sensor
  const handleForceSensorRead = (id: string) => {
    setSensors(prev => prev.map(sensor => {
      if (sensor.id === id) {
        // Generate minor realistic jitter variance
        const variance = (Math.random() - 0.5) * (sensor.value * 0.05);
        let newValue = sensor.value + variance;
        if (sensor.id === 'rain' && newValue < 0) newValue = 0;

        // Verify safety range limits
        let status: 'normal' | 'warning' | 'critical' = 'normal';
        if (newValue < sensor.minRange * 0.8 || newValue > sensor.maxRange * 1.2) {
          status = 'critical';
        } else if (newValue < sensor.minRange || newValue > sensor.maxRange) {
          status = 'warning';
        }

        // Trigger dynamic warning alarm if threshold exceeded
        if (status !== 'normal' && sensor.status === 'normal') {
          const alarm: NotificationItem = {
            id: `n-${Date.now()}`,
            title: `${sensor.name} Alert`,
            message: `${sensor.name} reading exceeded safe parameters: ${newValue.toFixed(1)} ${sensor.unit}.`,
            type: status === 'critical' ? 'alert' : 'warning',
            time: 'Just now',
            read: false
          };
          setNotifications(prevAlerts => [alarm, ...prevAlerts]);
        }

        // Append to history logs
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedHistory = [...sensor.history.slice(1), { time: timeStr, value: newValue }];

        return {
          ...sensor,
          value: newValue,
          status,
          history: updatedHistory,
          lastUpdated: 'Just now'
        };
      }
      return sensor;
    }));
  };

  // 5. Query Gemini AI to analyze climate matrix & yield recommendations
  const handleTriggerAiAnalysis = async () => {
    setIsAnalyzingAi(true);
    
    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensors, weather })
      });

      const data = await response.json();
      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
        
        // Push notification of success
        const notification: NotificationItem = {
          id: `n-${Date.now()}`,
          title: 'AI Advisory Updated',
          message: 'Gemini model successfully completed climate matrix scan and generated 3 fresh advisories.',
          type: 'success',
          time: 'Just now',
          read: false
        };
        setNotifications(prev => [notification, ...prev]);
      }
    } catch (error) {
      console.warn("AI backend analysis bypassed or key missing. Calculating fallback advice...", error);
      
      // Sophisticated offline/local backup analytical models rule processing
      setTimeout(() => {
        const fallbacks: AIRecommendation[] = [];
        
        // Process air temp
        const tempSensor = sensors.find(s => s.id === 'temp');
        if (tempSensor && tempSensor.value > 26) {
          fallbacks.push({
            id: `rec-temp-${Date.now()}`,
            trigger: 'Elevated Temperature Threshold',
            recommendation: 'Actuate Exhaust Ventilation',
            reason: `Ambient greenhouse temperature is ${tempSensor.value.toFixed(1)}°C, exceeding growth optimal ${tempSensor.maxRange}°C.`,
            targetDevice: 'exhaust-fan',
            suggestedState: 'ON',
            implemented: false
          });
        }

        // Process soil moisture
        const soilSensor = sensors.find(s => s.id === 'soil');
        if (soilSensor && soilSensor.value < 30) {
          fallbacks.push({
            id: `rec-soil-${Date.now()}`,
            trigger: 'Critical Soil Drought',
            recommendation: 'Start High-Flow Water Pump',
            reason: `Soil moisture level is depleted at ${soilSensor.value.toFixed(1)}%, failing growth benchmark (${soilSensor.minRange}%).`,
            targetDevice: 'water-pump',
            suggestedState: 'ON',
            implemented: false
          });
        }

        // Process light level
        const lightSensor = sensors.find(s => s.id === 'light');
        if (lightSensor && lightSensor.value < 300) {
          fallbacks.push({
            id: `rec-light-${Date.now()}`,
            trigger: 'Insufficient Solar Photoperiod',
            recommendation: 'Turn ON Auxiliary Grow Lights',
            reason: `Ambient greenhouse Lux is ${lightSensor.value.toFixed(0)} Lux, below recommended synthetic requirements.`,
            targetDevice: 'grow-light',
            suggestedState: 'ON',
            implemented: false
          });
        }

        if (fallbacks.length > 0) {
          setRecommendations(fallbacks);
        }
      }, 500);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  // 6. Actuates the AI recommendation action
  const handleImplementRecommendation = (recId: string, deviceId: string, suggestedState: 'ON' | 'OFF' | 'AUTO') => {
    // 1. Mark recommendation as completed
    setRecommendations(prev => prev.map(rec => {
      if (rec.id === recId) return { ...rec, implemented: true };
      return rec;
    }));

    // 2. Flip target physical device
    setDevices(prev => prev.map(dev => {
      if (dev.id === deviceId) {
        return {
          ...dev,
          status: suggestedState === 'AUTO' ? dev.status : suggestedState,
          mode: suggestedState === 'AUTO' ? 'AUTO' : 'MANUAL',
          lastToggled: 'Just now'
        };
      }
      return dev;
    }));

    // 3. Prep notification
    const completionAlert: NotificationItem = {
      id: `n-${Date.now()}`,
      title: 'Advisory Action Applied',
      message: `Overruled system to apply recommendation. Switched ${deviceId.toUpperCase()} to ${suggestedState}.`,
      type: 'success',
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [completionAlert, ...prev]);
  };

  // 7. Sync meteorological conditions
  const handleFetchLatestWeather = async () => {
    setIsLoadingWeather(true);
    try {
      const res = await fetch('/api/weather');
      const data = await res.json();
      if (data && data.temp) {
        setWeather(data);
        // Prepend success log
        const alert: NotificationItem = {
          id: `n-${Date.now()}`,
          title: 'Meteorology Sync Complete',
          message: `Station weather successfully synchronized with metropolitan coordinate: ${data.condition}.`,
          type: 'info',
          time: 'Just now',
          read: false
        };
        setNotifications(prev => [alert, ...prev]);
      }
    } catch (err) {
      console.warn("Weather API sync failed, continuing offline simulation gracefully.", err);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Clear unread alarm counts
  const unreadAlertsCount = notifications.filter(n => !n.read).length;
  const markAlertsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Forced authentication lock
  if (!userEmail) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className={`min-h-screen text-slate-100 font-sans flex flex-col justify-between ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Outer Wrapper layout */}
      <div className="flex h-screen overflow-hidden">
        
        {/* Sidebar Component */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen}
          onLogout={handleLogout}
          userEmail={userEmail}
        />

        {/* Primary Content Container */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative custom-scrollbar bg-slate-950/25">
          
          {/* Main Top Navbar */}
          <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-slate-900/40 border-b border-slate-800/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button 
                id="sidebar-toggle-btn"
                onClick={() => setSidebarOpen(true)} 
                className="p-2 bg-slate-800/60 hover:bg-slate-700/60 rounded-xl text-slate-300 hover:text-white lg:hidden cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold text-white capitalize flex items-center gap-2">
                {activeTab.replace('-', ' ')}
              </h2>
            </div>

            {/* Notification and Quick profile buttons */}
            <div className="flex items-center gap-3.5">
              
              {/* Notification bell switch */}
              <div className="relative">
                <button
                  id="toggle-notifications-btn"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    if (!notificationsOpen) markAlertsRead();
                  }}
                  className="p-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-300 hover:text-white relative cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  {unreadAlertsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>

                {/* Notifications Sliding Dropdown Drawer */}
                {notificationsOpen && (
                  <div id="notifications-drawer" className="absolute right-0 mt-3 w-80 rounded-2xl bg-slate-900 border border-slate-800/90 p-4 shadow-2xl z-50 max-h-[380px] overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between border-b border-slate-800/50 pb-2.5 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Telemetry Alerts</span>
                      <button 
                        id="close-notifications-btn"
                        onClick={() => setNotificationsOpen(false)} 
                        className="text-slate-500 hover:text-slate-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {notifications.length === 0 ? (
                        <p className="text-center text-xs text-slate-500 py-6">All systems quiet. No alarms.</p>
                      ) : (
                        notifications.map((alert) => (
                          <div 
                            key={alert.id} 
                            className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
                              alert.type === 'alert' 
                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' 
                                : alert.type === 'warning' 
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' 
                                : alert.type === 'success'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                : 'bg-slate-950/40 border-slate-800/50 text-slate-300'
                            }`}
                          >
                            <div className="mt-0.5">
                              {alert.type === 'alert' ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                              ) : alert.type === 'warning' ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                              ) : alert.type === 'success' ? (
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Info className="w-3.5 h-3.5 text-cyan-400" />
                              )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <h5 className="text-xs font-bold leading-tight">{alert.title}</h5>
                              <p className="text-[10px] opacity-80 mt-0.5 leading-relaxed truncate">{alert.message}</p>
                              <span className="text-[8px] opacity-50 block mt-1">{alert.time}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Settings quick shortcut profile link */}
              <button 
                id="quick-profile-settings-btn"
                onClick={() => setActiveTab('settings')}
                className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/60 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer"
              >
                <User className="w-4 h-4" />
              </button>

            </div>
          </header>

          {/* Active View Module Content Panel */}
          <main className="flex-1 p-5 max-w-7xl mx-auto w-full">
            {activeTab === 'dashboard' && (
              <WeatherWidget 
                weather={weather} 
                hourlyForecast={defaultHourlyForecast} 
                sensors={sensors}
                onFetchLatest={handleFetchLatestWeather}
                isLoading={isLoadingWeather}
              />
            )}
            
            {activeTab === 'environment' && (
              <SensorsView 
                sensors={sensors} 
                onForceSensorRead={handleForceSensorRead} 
              />
            )}

            {activeTab === 'device-control' && (
              <ControlView 
                devices={devices} 
                onToggleDevice={handleToggleDevice}
                onChangeDeviceMode={handleChangeDeviceMode}
                onUpdateSchedule={handleUpdateSchedule}
              />
            )}

            {activeTab === 'forecast' && (
              <ForecastView 
                weeklyForecast={defaultWeeklyForecast} 
                hourlyForecast={defaultHourlyForecast}
                weather={weather}
              />
            )}

            {activeTab === 'ai-insights' && (
              <AiInsightsView 
                recommendations={recommendations}
                onTriggerAiAnalysis={handleTriggerAiAnalysis}
                onImplementRecommendation={handleImplementRecommendation}
                isAnalyzing={isAnalyzingAi}
                sensors={sensors}
                weather={weather}
              />
            )}

            {activeTab === 'plant-health' && (
              <PlantHealthView />
            )}

            {activeTab === 'energy' && (
              <EnergyView energy={energy} />
            )}

            {activeTab === 'reports' && (
              <ReportsView />
            )}

            {activeTab === 'settings' && (
              <SettingsView 
                onLogout={handleLogout} 
                userEmail={userEmail} 
                theme={theme}
                onChangeTheme={setTheme}
              />
            )}
          </main>

        </div>

      </div>

    </div>
  );
}
