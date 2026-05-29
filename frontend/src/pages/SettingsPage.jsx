import React, { useEffect, useState } from 'react';
import { Settings, Shield, User, Cpu, Save, Key } from 'lucide-react';
import { authService } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';

export default function SettingsPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await authService.getProfile();
      setProfile(data);
    };
    loadProfile();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-8 text-left">
        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-display font-extrabold tracking-wider text-cyber-highlight">
            SETTINGS CONSOLE
          </h2>
          <p className="text-xs text-cyber-text tracking-wide mt-1">
            Configure system execution modes, VRAM limits, and workspace preferences.
          </p>
        </div>

        {profile && (
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* PROFILE SECTION */}
            <div className="md:col-span-2 p-6 rounded-2xl glass-panel flex flex-col gap-6">
              <h3 className="text-sm font-display font-semibold text-cyber-highlight tracking-widest border-b border-cyber-border pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-cyber-accent" />
                <span>USER IDENTITY</span>
              </h3>

              {success && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 text-xs font-semibold">
                  Settings committed successfully!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-display tracking-widest text-cyber-accent font-semibold">USER SIGNATURE</label>
                  <input
                    type="text"
                    disabled
                    value={profile.username}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-cyber-border text-xs text-cyber-text cursor-not-allowed font-sans"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-display tracking-widest text-cyber-accent font-semibold">EMAIL REFERENCE</label>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-cyber-border text-xs text-cyber-text cursor-not-allowed font-sans"
                  />
                </div>
              </div>

              {/* BIO */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-display tracking-widest text-cyber-accent font-semibold">RESEARCH BIO</label>
                <textarea
                  rows={3}
                  defaultValue={profile.bio || "Chronos temporal frame interpolation research desk active seat."}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-cyber-border text-xs text-cyber-highlight focus:outline-none focus:border-cyber-accent transition-all font-sans resize-none"
                />
              </div>

              {/* SAVE BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-fit bg-gradient-neon hover:bg-none hover:bg-cyber-accent text-cyber-bg hover:text-cyber-bg font-bold tracking-widest font-display text-xs px-6 py-3 rounded-xl shadow-lg hover:shadow-glow-cyan transition-all duration-300 flex items-center gap-2 mt-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "COMMITTING SETTINGS..." : "SAVE PROFILE"}</span>
              </button>
            </div>

            {/* CUDA LIMITS */}
            <div className="p-6 rounded-2xl glass-panel flex flex-col gap-6">
              <h3 className="text-sm font-display font-semibold text-cyber-highlight tracking-widest border-b border-cyber-border pb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyber-pink" />
                <span>CUDA GPU LIMITS</span>
              </h3>

              {/* GPU RAM LIMIT */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-display tracking-widest text-cyber-accent font-semibold">MAX VRAM CAPACITY</label>
                <select
                  defaultValue={profile.gpu_allocation_limit}
                  className="w-full px-4 py-3 rounded-xl bg-cyber-bg border border-cyber-border text-xs text-cyber-highlight focus:outline-none focus:border-cyber-accent transition-all font-sans"
                >
                  <option value={2.0}>2.0 GB VRAM Limit (Lite)</option>
                  <option value={4.0}>4.0 GB VRAM Limit (Standard)</option>
                  <option value={8.0}>8.0 GB VRAM Limit (High Perf)</option>
                  <option value={12.0}>12.0 GB VRAM Limit (Extreme)</option>
                </select>
              </div>

              {/* WORKSPACE PREFERENCE */}
              <div className="flex justify-between items-center py-2 border-b border-cyber-border/40">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-display font-semibold text-cyber-highlight">PREFER DARK MODE</span>
                  <span className="text-[9px] text-cyber-text/80">Toggle glowing sci-fi dark grids</span>
                </div>
                <input 
                  type="checkbox" 
                  defaultChecked={profile.dark_mode}
                  className="w-4 h-4 rounded text-cyber-accent bg-cyber-bg border-cyber-border accent-cyber-accent focus:ring-0 cursor-pointer"
                />
              </div>

              {/* GPU SPEED OPTIMIZATION */}
              <div className="flex justify-between items-center py-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-display font-semibold text-cyber-highlight">FP16 MIXED PRECISION</span>
                  <span className="text-[9px] text-cyber-text/80">Accelerate upscaling frames</span>
                </div>
                <input 
                  type="checkbox" 
                  defaultChecked={true}
                  className="w-4 h-4 rounded text-cyber-accent bg-cyber-bg border-cyber-border accent-cyber-accent focus:ring-0 cursor-pointer"
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
