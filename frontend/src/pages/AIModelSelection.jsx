import React, { useState } from 'react';
import { Binary, Gauge, Cpu, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

export default function AIModelSelection() {
  const [selectedModel, setSelectedModel] = useState('RIFE');

  const models = [
    {
      id: 'RIFE',
      name: 'RIFE v4.8 (Real-Time Flow)',
      tagline: 'Recommended for general dynamic sequencing and fluid maps.',
      description: 'Real-Time Intermediate Flow Estimation. Utilizes a lightweight neural network tailored to direct motion-compensated warping. Delivers unmatched synthesis speed with superb boundary sharpness.',
      accuracy: 94.8,
      speed: '14.5 FPS',
      gpuReq: '2.0 GB VRAM',
      latency: '12ms',
      pros: ['Ultra fast inference', 'Sharp spatial edges', 'Excellent frame consistency'],
      cons: ['Slightly struggles on extreme wide baseline displacements']
    },
    {
      id: 'DAIN',
      name: 'DAIN (Depth-Aware Video)',
      tagline: 'Recommended for 3D aerial topology and orthorectified scans.',
      description: 'Depth-Aware Video Frame Interpolation. Explores depth maps dynamically from consecutive frames to accurately morph objects along spatial depth layers. Perfect for top-down structural GIS renderings.',
      accuracy: 96.4,
      speed: '4.2 FPS',
      gpuReq: '6.5 GB VRAM',
      latency: '45ms',
      pros: ['Precise 3D edge boundaries', 'Dynamic depth layering', 'Best spatial scaling'],
      cons: ['Heavy memory consumption', 'Slow processing times']
    },
    {
      id: 'FILM',
      name: 'FILM (Frame Interpolation for Large Motion)',
      tagline: 'Recommended for low-frequency scans and wide baseline time lapses.',
      description: 'Frame Interpolation for Large Motion. Created by Google Research. Employs a multi-scale feature extractor matching wide gaps or significant displacement movements seamlessly. Handles long frame boundaries gracefully.',
      accuracy: 95.9,
      speed: '8.4 FPS',
      gpuReq: '4.0 GB VRAM',
      latency: '22ms',
      pros: ['Handles massive jumps/displacements', 'Outstanding structural details', 'Multi-scale warping'],
      cons: ['Can blur complex high-frequency spatial noise patterns']
    },
    {
      id: 'SUPER_SLOMO',
      name: 'Super SloMo (Super Slow Motion)',
      tagline: 'Recommended for high-frame rate radar waves & smooth coastal flows.',
      description: 'Developed by NVIDIA. Fully computes bidirectional optical flow vector layers and maps them forward seamlessly. Perfect for generating continuous arbitrary fluid flow intermediate states.',
      accuracy: 92.5,
      speed: '18.2 FPS',
      gpuReq: '1.5 GB VRAM',
      latency: '9ms',
      pros: ['Arbitrary frame rate factor upscaling', 'Lightweight runtime footprint', 'Very high throughput'],
      cons: ['Can exhibit occasional warping artifacts around fast border items']
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-8 text-left">
        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-display font-extrabold tracking-wider text-cyber-highlight">
            AI MODEL DECK
          </h2>
          <p className="text-xs text-cyber-text tracking-wide mt-1">
            Compare and deploy deep learning architectures optimized for temporal raster sequence synthesis.
          </p>
        </div>

        {/* MODELS COMPARATIVE DECK */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* SELECT LIST */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`p-6 rounded-2xl glass-panel text-left flex flex-col gap-2 transition-all duration-300 border ${
                  selectedModel === model.id 
                    ? 'border-cyber-accent bg-cyber-accent/5 shadow-glow-cyan' 
                    : 'border-cyber-border hover:border-cyber-accent/40'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-display text-sm font-bold text-cyber-highlight">{model.id}</span>
                  {selectedModel === model.id && <ShieldCheck className="w-4 h-4 text-cyber-accent" />}
                </div>
                <span className="text-[10px] text-cyber-text line-clamp-1">{model.name}</span>
              </button>
            ))}
          </div>

          {/* ACTIVE MODEL SPEC SHEET */}
          {(() => {
            const active = models.find(m => m.id === selectedModel);
            if (!active) return null;
            return (
              <div className="lg:col-span-2 p-8 rounded-3xl glass-panel flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-neon opacity-[0.02] blur-3xl -z-10" />

                {/* TITLE & TAGLINE */}
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyber-accent/10 border border-cyber-accent/30 w-fit text-[9px] font-display font-bold text-cyber-accent tracking-widest">
                    ACTIVE ARCHITECTURE
                  </div>
                  <h3 className="text-xl font-display font-extrabold text-cyber-highlight">
                    {active.name}
                  </h3>
                  <p className="text-xs text-cyber-accent/80 font-semibold tracking-wide">
                    {active.tagline}
                  </p>
                </div>

                {/* DESCRIPTION */}
                <p className="text-xs text-cyber-text leading-relaxed bg-black/25 border border-cyber-border/40 p-4 rounded-xl font-sans">
                  {active.description}
                </p>

                {/* RADAR SPEC WIDGET GRIDS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-black/35 border border-cyber-border text-center">
                    <span className="text-[9px] font-display tracking-widest text-cyber-text/60">ACCURACY SSIM</span>
                    <div className="text-lg font-display font-bold text-emerald-400 mt-1.5">{active.accuracy}%</div>
                  </div>
                  <div className="p-4 rounded-xl bg-black/35 border border-cyber-border text-center">
                    <span className="text-[9px] font-display tracking-widest text-cyber-text/60">THROUGHPUT</span>
                    <div className="text-lg font-display font-bold text-cyber-accent mt-1.5">{active.speed}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-black/35 border border-cyber-border text-center">
                    <span className="text-[9px] font-display tracking-widest text-cyber-text/60">MEM TARGET</span>
                    <div className="text-lg font-display font-bold text-cyber-purple mt-1.5">{active.gpuReq}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-black/35 border border-cyber-border text-center">
                    <span className="text-[9px] font-display tracking-widest text-cyber-text/60">LATENCY</span>
                    <div className="text-lg font-display font-bold text-cyber-pink mt-1.5">{active.latency}</div>
                  </div>
                </div>

                {/* PROS & CONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-cyber-border">
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-display font-bold tracking-widest text-emerald-400">ADVANTAGES</span>
                    <ul className="flex flex-col gap-2">
                      {active.pros.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-cyber-text leading-relaxed">
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-display font-bold tracking-widest text-cyber-pink">LIMITATIONS</span>
                    <ul className="flex flex-col gap-2">
                      {active.cons.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-cyber-text leading-relaxed">
                          <AlertTriangle className="w-4 h-4 text-cyber-pink flex-shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </DashboardLayout>
  );
}
