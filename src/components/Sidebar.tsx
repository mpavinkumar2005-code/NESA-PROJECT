import React from 'react';
import { 
  LayoutDashboard, 
  Droplets, 
  Cpu, 
  Calendar, 
  Sparkles, 
  HeartPulse,
  BatteryCharging, 
  BarChart3, 
  Settings, 
  LogOut,
  X,
  Menu,
  CloudSun
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  userEmail?: string;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen,
  onLogout,
  userEmail
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'environment', name: 'Environment', icon: Droplets },
    { id: 'device-control', name: 'Device Control', icon: Cpu },
    { id: 'forecast', name: 'Forecast', icon: Calendar },
    { id: 'ai-insights', name: 'AI Insights', icon: Sparkles },
    { id: 'plant-health', name: 'Plant Health', icon: HeartPulse },
    { id: 'energy', name: 'Energy', icon: BatteryCharging },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          id="sidebar-backdrop"
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900/80 border-r border-slate-800/60 backdrop-blur-xl transform transition-all duration-300 ease-in-out z-50 lg:translate-x-0 lg:static flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/20">
                <CloudSun className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-sm font-semibold tracking-wide text-white leading-tight">
                  NESA AI
                </h1>
                <span className="text-[10px] text-cyan-400 font-medium tracking-widest uppercase">
                  Novel Edge Adaptive
                </span>
              </div>
            </div>
            <button 
              id="sidebar-close-btn"
              onClick={() => setIsOpen(false)} 
              className="p-1 hover:bg-slate-800 rounded-lg lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User profile brief */}
          {userEmail && (
            <div className="px-5 py-4 border-b border-slate-800/40 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate">{userEmail}</p>
                <span className="text-[10px] text-emerald-400 font-medium">● Connected</span>
              </div>
            </div>
          )}

          {/* Sidebar Menu Items */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  id={`sidebar-item-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 text-cyan-400 border-l-4 border-cyan-400 shadow-md shadow-cyan-950/20' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-800/40">
            <button
              id="sidebar-logout-btn"
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Disconnect</span>
            </button>
            <div className="mt-4 text-center">
              <p className="text-[9px] text-slate-500 tracking-wider font-medium">IEEE PROJECT B-GRID © 2026</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
