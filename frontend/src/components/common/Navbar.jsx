import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Cpu, LogOut, User as UserIcon, Layers } from 'lucide-react';
import { authService } from '../../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('access_token');

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-cyber-bg/40 backdrop-blur-md border-b border-cyber-border py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
      {/* HOLOGRAPHIC LOGO */}
      <Link to={token ? "/dashboard" : "/login"} className="flex items-center gap-2 select-none group">
        <div className="relative p-2 rounded-lg bg-cyber-accent/10 border border-cyber-accent/30 group-hover:border-cyber-accent transition-all duration-300">
          <Cpu className="w-6 h-6 text-cyber-accent animate-pulse" />
          <div className="absolute inset-0 bg-cyber-accent/20 blur rounded-lg -z-10 group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        </div>
        <span className="font-display font-bold text-lg md:text-xl tracking-wider text-cyber-highlight group-hover:text-cyber-accent transition-colors duration-300">
          CHRONOS<span className="text-cyber-accent font-light">.WMS</span>
        </span>
      </Link>

      {/* NAV LINKS */}
      <div className="hidden lg:flex items-center gap-8 font-display text-sm tracking-widest">
        <Link 
          to="/demo" 
          className={`hover:text-cyber-accent transition-colors ${isActive('/demo') ? 'text-cyber-accent font-semibold border-b border-cyber-accent pb-1' : 'text-cyber-text'}`}
        >
          DEMO
        </Link>
        {token && (
          <>
            <Link 
              to="/dashboard" 
              className={`hover:text-cyber-accent transition-colors ${isActive('/dashboard') ? 'text-cyber-accent font-semibold border-b border-cyber-accent pb-1' : 'text-cyber-text'}`}
            >
              DASHBOARD
            </Link>
            <Link 
              to="/upload" 
              className={`hover:text-cyber-accent transition-colors ${isActive('/upload') ? 'text-cyber-accent font-semibold border-b border-cyber-accent pb-1' : 'text-cyber-text'}`}
            >
              UPLOAD
            </Link>
            <Link 
              to="/studio" 
              className={`hover:text-cyber-accent transition-colors ${isActive('/studio') ? 'text-cyber-accent font-semibold border-b border-cyber-accent pb-1' : 'text-cyber-text'}`}
            >
              STUDIO
            </Link>
            <Link 
              to="/models" 
              className={`hover:text-cyber-accent transition-colors ${isActive('/models') ? 'text-cyber-accent font-semibold border-b border-cyber-accent pb-1' : 'text-cyber-text'}`}
            >
              AI MODELS
            </Link>
            <Link 
              to="/analytics" 
              className={`hover:text-cyber-accent transition-colors ${isActive('/analytics') ? 'text-cyber-accent font-semibold border-b border-cyber-accent pb-1' : 'text-cyber-text'}`}
            >
              ANALYTICS
            </Link>
          </>
        )}
      </div>

      {/* AUTH CONTROLS */}
      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-4">
            <Link to="/settings" className="p-2 rounded-full border border-cyber-border hover:border-cyber-accent text-cyber-text hover:text-cyber-highlight transition-all">
              <UserIcon className="w-4 h-4" />
            </Link>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-gradient-to-r from-red-600/20 to-cyber-pink/20 hover:from-red-600 hover:to-cyber-pink border border-cyber-pink/50 hover:border-cyber-pink text-cyber-highlight px-4 py-2 rounded-lg text-sm tracking-wider font-display transition-all duration-300 shadow-sm hover:shadow-glow-pink"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">EXIT</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="text-cyber-text hover:text-cyber-highlight font-display text-sm tracking-wider px-4 py-2 hover:bg-white/5 rounded-lg transition-all"
            >
              LOGIN
            </Link>
            <Link 
              to="/register" 
              className="bg-gradient-neon border border-cyber-accent hover:border-white text-cyber-bg hover:text-cyber-highlight px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wider font-display transition-all duration-300 shadow-md hover:shadow-glow-cyan"
            >
              INITIALIZE
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
