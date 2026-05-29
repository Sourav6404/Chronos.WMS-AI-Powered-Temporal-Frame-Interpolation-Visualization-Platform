import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { authService } from '../services/api';
import BackgroundParticles from '../components/common/BackgroundParticles';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid host key or signature credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <BackgroundParticles />

      {/* LOGIN CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 rounded-3xl glass-panel-glow border-cyber-accent/30 relative"
      >
        <div className="absolute top-0 right-0 p-4">
          <Sparkles className="w-5 h-5 text-cyber-accent animate-pulse" />
        </div>

        <div className="flex flex-col items-center gap-4 text-center mb-8">
          <div className="p-3 rounded-full bg-cyber-accent/15 border border-cyber-accent/40 shadow-glow-cyan">
            <ShieldCheck className="w-8 h-8 text-cyber-accent" />
          </div>
          <h2 className="text-2xl font-display font-bold tracking-widest text-cyber-highlight">
            NODE IDENTITY SYSTEM
          </h2>
          <p className="text-xs text-cyber-text tracking-wide">
            Enter host credentials to decrypt data visualization deck.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-cyber-pink/10 border border-cyber-pink/30 text-cyber-pink text-xs font-semibold mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
          {/* USERNAME */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-display tracking-widest text-cyber-accent font-semibold">USER SIGNATURE</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-cyber-text">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., researcher_alpha"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-cyber-border text-sm text-cyber-highlight placeholder-cyber-text/40 focus:outline-none focus:border-cyber-accent focus:shadow-glow-cyan transition-all font-sans"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-display tracking-widest text-cyber-accent font-semibold">ACCESS KEY</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-cyber-text">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-cyber-border text-sm text-cyber-highlight placeholder-cyber-text/40 focus:outline-none focus:border-cyber-accent focus:shadow-glow-cyan transition-all font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-neon hover:bg-none hover:bg-cyber-accent text-cyber-bg hover:text-cyber-bg font-bold tracking-widest font-display text-sm py-4 rounded-xl shadow-lg hover:shadow-glow-cyan transition-all duration-300 flex items-center justify-center gap-3 mt-4"
          >
            <span>{loading ? "INITIALIZING SECURE LINK..." : "DECRYPT INTERFACE"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 text-center text-xs tracking-wider font-display text-cyber-text/60">
          <span>NO ACCESS? </span>
          <Link to="/register" className="text-cyber-accent hover:underline font-bold transition-all">
            REGISTER SECURITY TOKEN
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
