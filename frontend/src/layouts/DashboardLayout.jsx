import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, UploadCloud, Video, BarChart3, Binary, 
  History, Settings, ShieldAlert, Cpu, Bell, Activity 
} from 'lucide-react';
import { analyticsService } from '../services/api';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      const data = await analyticsService.getSystemStats();
      setStats(data);
    };
    fetchStats();
    
    // Auto-update stats every 8s
    const interval = setInterval(fetchStats, 8000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Upload Studio', icon: UploadCloud, path: '/upload' },
    { name: 'Visualization Studio', icon: Video, path: '/studio' },
    { name: 'AI Model Panel', icon: Binary, path: '/models' },
    { name: 'Analytics Console', icon: BarChart3, path: '/analytics' },
    { name: 'Project History', icon: History, path: '/history' },
    { name: 'Settings Console', icon: Settings, path: '/settings' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-cyber-bg flex pt-20">
      {/* SIDEBAR */}
      <aside className="w-72 fixed top-20 left-0 bottom-0 border-r border-cyber-border bg-[#0a0b10]/85 backdrop-blur-xl p-6 hidden lg:flex flex-col justify-between z-30">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-cyber-accent/5 border border-cyber-accent/25">
            <Activity className="w-5 h-5 text-cyber-accent animate-pulse" />
            <div>
              <div className="text-xs font-semibold tracking-wider text-cyber-highlight font-display">SYSTEM ONLINE</div>
              <div className="text-[10px] text-emerald-400 font-semibold tracking-wider">GPU ACCELERATED</div>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {menuItems.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg font-display text-sm tracking-wider transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-neon text-cyber-bg font-bold shadow-glow-cyan border border-cyber-accent'
                      : 'text-cyber-text hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* SIDEBAR BOTTOM WIDGET: GPU HEALTH */}
        {stats && (
          <div className="p-4 rounded-xl glass-panel flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-display font-semibold text-cyber-highlight">GPU TEMP</span>
              <span className="font-semibold text-cyber-accent">{stats ? Math.round(40 + (stats.gpu_usage_pct * 0.45)) : 54}°C</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-neon" style={{ width: `${stats ? Math.min(100, Math.round(40 + (stats.gpu_usage_pct * 0.45))) : 45}%` }} />
            </div>
            <div className="flex justify-between items-center text-[10px] text-cyber-text font-semibold">
              <span>LOAD: {stats.gpu_usage_pct}%</span>
              <span>MEM: 1.8GB / {stats.gpu_usage_pct > 15 ? '8GB' : '4GB'}</span>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-full">
        {/* TOPBAR */}
        <header className="h-16 border-b border-cyber-border px-6 md:px-12 flex justify-between items-center bg-[#0a0b10]/40 backdrop-blur-md sticky top-20 z-20">
          <div className="flex items-center gap-4 text-cyber-highlight font-display tracking-widest text-sm">
            <span>NODE // CHRONOS_MAIN</span>
          </div>
          <div className="flex items-center gap-6">
            {/* NOTIFICATIONS */}
            <div className="relative cursor-pointer p-2 rounded-lg hover:bg-white/5 text-cyber-text hover:text-cyber-highlight transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyber-pink animate-ping" />
            </div>
            {/* USER STATS PROFILE */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-cyber-accent/50 bg-cyber-accent/15 flex items-center justify-center font-display font-bold text-cyber-accent text-xs">
                AI
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-cyber-highlight font-display">RESEARCHER</div>
                <div className="text-[10px] text-cyber-text">HOST MODE</div>
              </div>
            </div>
          </div>
        </header>

        {/* CHILD COMPONENT ROUTE MOUNT */}
        <main className="p-6 md:p-12 flex-1 relative overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
