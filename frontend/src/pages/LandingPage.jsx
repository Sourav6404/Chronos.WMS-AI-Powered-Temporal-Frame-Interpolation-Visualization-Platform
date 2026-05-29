import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Upload, BarChart2, Shield, Zap, Sparkles, ChevronRight } from 'lucide-react';
import BackgroundParticles from '../components/common/BackgroundParticles';

export default function LandingPage() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const features = [
    { icon: Zap, title: "Super Slow Motion Synthesis", desc: "Synthesize high-frequency intermediates dynamically from any static raster scans." },
    { icon: BarChart2, title: "Dense Optical Flow Heatmaps", desc: "Evaluate sub-pixel motion vector profiles directly within WMS coordinate maps." },
    { icon: Shield, title: "Spatial Warp Verification", desc: "Validate structural smoothness using high-resolution structural similarity indices." }
  ];

  return (
    <div className="relative min-h-screen pt-20 overflow-x-hidden flex flex-col justify-between">
      {/* CANVAS PARTICLES BG */}
      <BackgroundParticles />

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center flex-grow">
        <div className="flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-cyber-accent/40 w-fit text-xs font-semibold tracking-wider text-cyber-accent font-display">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI ENGINE V2.4 NOW LIVE</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-neon glow-cyan">
            AI-Powered Temporal Frame Interpolation
          </h1>

          <p className="text-base md:text-lg text-cyber-text max-w-lg leading-relaxed">
            Generate ultra-smooth temporal visualizations using advanced computer vision and deep learning architectures. Overcome temporal aliasing in Web Map Services seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link 
              to="/dashboard" 
              className="bg-gradient-neon border border-cyber-accent hover:border-white text-cyber-bg hover:text-cyber-highlight px-8 py-4 rounded-xl text-sm font-bold tracking-widest font-display transition-all duration-300 shadow-lg hover:shadow-glow-cyan flex items-center justify-center gap-3"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>START VISUALIZATION</span>
            </Link>
            <Link 
              to="/login" 
              className="glass-panel border-cyber-border hover:border-cyber-accent px-8 py-4 rounded-xl text-sm font-semibold tracking-widest font-display transition-all duration-300 flex items-center justify-center gap-3 text-cyber-highlight"
            >
              <Upload className="w-4 h-4" />
              <span>UPLOAD FRAMES</span>
            </Link>
          </div>
        </div>

        {/* INTERACTIVE COMPARISON SLIDER */}
        <div className="flex flex-col gap-4">
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative aspect-video rounded-2xl overflow-hidden glass-panel border border-cyber-accent/30 shadow-2xl select-none cursor-ew-resize"
          >
            {/* ORIGINAL SIDE (LEFT) */}
            <div className="absolute inset-0 bg-[#0c0d14]">
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 text-center">
                <div className="text-9xl text-cyber-pink/10 font-bold select-none">15 FPS</div>
                <div className="text-xs text-cyber-pink font-semibold tracking-wider font-display bg-cyber-pink/10 border border-cyber-pink/30 px-3 py-1 rounded">
                  ORIGINAL SKIPPING SEQUENCE
                </div>
              </div>
            </div>

            {/* INTERPOLATED SIDE (RIGHT) */}
            <div 
              className="absolute inset-y-0 right-0 overflow-hidden bg-gradient-cyber"
              style={{ left: `${sliderPosition}%` }}
            >
              <div 
                className="absolute inset-0 w-full"
                style={{ width: containerRef.current ? containerRef.current.getBoundingClientRect().width : '100%', left: `-${sliderPosition}%` }}
              >
                {/* Glowing AI visualizer effect */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,242,254,0.15),transparent_60%)]" />
                <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 text-center">
                  <div className="text-9xl text-cyber-accent/20 font-bold select-none animate-pulse-slow">60 FPS</div>
                  <div className="text-xs text-cyber-accent font-semibold tracking-wider font-display bg-cyber-accent/10 border border-cyber-accent/30 px-3 py-1 rounded shadow-glow-cyan">
                    SYNTHESIZED TEMPORAL SMOOTHNESS
                  </div>
                </div>
              </div>
            </div>

            {/* SLIDER HANDLER LINE */}
            <div 
              className="compare-slider-handle"
              style={{ left: `${sliderPosition}%` }}
            />
            <div 
              className="compare-slider-button"
              style={{ left: `${sliderPosition}%` }}
            >
              <ChevronRight className="w-5 h-5 text-cyber-accent transform -rotate-180" />
              <ChevronRight className="w-5 h-5 text-cyber-accent ml-[-6px]" />
            </div>
          </div>
          <div className="flex justify-between items-center text-xs px-2 font-display text-cyber-text tracking-wider">
            <span>◄ DRAG TO VIEW ORIGINAL FRAME GAP</span>
            <span>SMOOTH AI UPSCALED ►</span>
          </div>
        </div>
      </main>

      {/* FEATURE CARDS DECK */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="p-8 rounded-2xl glass-panel hover:glass-panel-glow border-cyber-border hover:border-cyber-accent/40 transition-all duration-500 group text-left">
                <div className="w-12 h-12 rounded-xl bg-cyber-accent/5 border border-cyber-accent/25 flex items-center justify-center mb-6 group-hover:bg-cyber-accent group-hover:text-cyber-bg transition-all duration-300">
                  <Icon className="w-5 h-5 text-cyber-accent group-hover:text-cyber-bg" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-3 text-cyber-highlight group-hover:text-cyber-accent transition-colors duration-300">
                  {feat.title}
                </h3>
                <p className="text-sm text-cyber-text leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 border-t border-cyber-border/40 bg-cyber-bg/60 backdrop-blur text-xs tracking-wider text-cyber-text/60 font-display">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© 2026 CHRONOS temporal visualization laboratory.</span>
          <div className="flex gap-6">
            <span className="hover:text-cyber-accent cursor-pointer transition-colors">NVIDIA RESEARCH INSPIRED</span>
            <span className="hover:text-cyber-accent cursor-pointer transition-colors">WMS COMPATIBLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
