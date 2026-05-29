import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { authService } from '../services/api';
import BackgroundParticles from '../components/common/BackgroundParticles';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.register(username, email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const errorMsg = Object.entries(data)
          .map(([key, val]) => `${key.toUpperCase()}: ${Array.isArray(val) ? val.join(' ') : val}`)
          .join(' | ');
        setError(errorMsg || "Signature sequence registration failed.");
      } else {
        setError("Signature sequence registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <BackgroundParticles />

      {/* REGISTER CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 rounded-3xl glass-panel-glow border-cyber-accent/30"
      >
        <div className="flex flex-col items-center gap-4 text-center mb-8">
          <div className="p-3 rounded-full bg-cyber-accent/15 border border-cyber-accent/40 shadow-glow-cyan">
            <KeyRound className="w-8 h-8 text-cyber-accent" />
          </div>
          <h2 className="text-2xl font-display font-bold tracking-widest text-cyber-highlight">
            REGISTER SECURITY TOKEN
          </h2>
          <p className="text-xs text-cyber-text tracking-wide">
            Provision a new researcher seat on Chronos cluster.
          </p>
        </div>

        {success && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 text-xs font-semibold mb-6">
            Seat provisioned successfully! Transferring to authentication terminal...
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-cyber-pink/10 border border-cyber-pink/30 text-cyber-pink text-xs font-semibold mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {/* USERNAME */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-display tracking-widest text-cyber-accent font-semibold">IDENTIFIER</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-cyber-text">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="researcher_alpha"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-cyber-border text-sm text-cyber-highlight placeholder-cyber-text/40 focus:outline-none focus:border-cyber-accent focus:shadow-glow-cyan transition-all font-sans"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-display tracking-widest text-cyber-accent font-semibold">EMAIL</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-cyber-text">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alpha@wms-lab.ai"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-cyber-border text-sm text-cyber-highlight placeholder-cyber-text/40 focus:outline-none focus:border-cyber-accent focus:shadow-glow-cyan transition-all font-sans"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1.5">
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
            <span>{loading ? "COMMITTING SECURE KEY..." : "PROVISION TOKEN"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 text-center text-xs tracking-wider font-display text-cyber-text/60">
          <span>ALREADY CREDENTIALED? </span>
          <Link to="/login" className="text-cyber-accent hover:underline font-bold transition-all">
            SIGN SIGNATURE
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
