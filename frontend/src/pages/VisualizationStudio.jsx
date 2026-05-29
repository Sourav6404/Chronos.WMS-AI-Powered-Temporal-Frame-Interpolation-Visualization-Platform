import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Play, Pause, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, 
  RotateCcw, Sliders, Maximize2, Shield, Radio, Cpu, Layers 
} from 'lucide-react';
import * as THREE from 'three';
import { projectService, processingService } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';

export default function VisualizationStudio() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project') || '1';
  
  const [project, setProject] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showVectors, setShowVectors] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [motionVectors, setMotionVectors] = useState([]);
  const [imageLoadError, setImageLoadError] = useState(false);

  const [maxFrame, setMaxFrame] = useState(20);
  const [isPreloading, setIsPreloading] = useState(true);
  const [preloadingProgress, setPreloadingProgress] = useState(0);

  useEffect(() => {
    setImageLoadError(false);
  }, [currentFrame, showHeatmap, projectId]);
  
  const canvasRef = useRef(null);
  const threeSceneRef = useRef(null);
  const playIntervalRef = useRef(null);

  // Load project details and calculate max frames dynamically
  useEffect(() => {
    const loadProject = async () => {
      const proj = await projectService.get(projectId);
      setProject(proj);
      const sourceFrames = proj.uploaded_files.filter(f => f.is_sequence_frame).length;
      if (sourceFrames > 0) {
        setMaxFrame((sourceFrames - 1) * proj.interpolation_factor + 1);
      } else {
        setMaxFrame(20);
      }
    };
    loadProject();
  }, [projectId]);

  // Preload frame images into browser memory cache for lag-free high-speed playback
  useEffect(() => {
    if (!project || maxFrame <= 0) return;
    
    setIsPreloading(true);
    setPreloadingProgress(0);
    let loadedCount = 0;
    
    for (let i = 0; i < maxFrame; i++) {
      const img = new Image();
      img.src = `/media/interpolated_frames/${projectId}/interp_${String(i).padStart(5, '0')}.png`;
      img.onload = () => {
        loadedCount++;
        setPreloadingProgress(Math.round((loadedCount / maxFrame) * 100));
        if (loadedCount === maxFrame) {
          setIsPreloading(false);
        }
      };
      img.onerror = () => {
        loadedCount++;
        setPreloadingProgress(Math.round((loadedCount / maxFrame) * 100));
        if (loadedCount === maxFrame) {
          setIsPreloading(false);
        }
      };
    }
  }, [projectId, project, maxFrame]);

  // Load motion vectors for current frame step
  useEffect(() => {
    const fetchVectors = async () => {
      const data = await processingService.getOpticalFlow(projectId, currentFrame);
      setMotionVectors(data.motion_vectors);
    };
    fetchVectors();
  }, [projectId, currentFrame]);

  // Handle auto-playing frame timeline sequence
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(1000 / (15 * playbackSpeed));
      playIntervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev >= maxFrame - 1 ? 0 : prev + 1));
      }, intervalMs);
    } else {
      clearInterval(playIntervalRef.current);
    }
    return () => clearInterval(playIntervalRef.current);
  }, [isPlaying, playbackSpeed, maxFrame]);

  // Three.js 3D Motion Vector Particle Simulation initialization
  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. Setup Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 250;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);

    // 2. Generate vector nodes
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Create grid-aligned points
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 120;
      const z = (Math.random() - 0.5) * 40;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color scheme gradient matching cyber purple / cyan
      const isCyan = Math.random() > 0.5;
      colors[i * 3] = isCyan ? 0.0 : 0.5; // R
      colors[i * 3 + 1] = isCyan ? 0.95 : 0.0; // G
      colors[i * 3 + 2] = isCyan ? 1.0 : 1.0; // B
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture
    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 3. Animation loops
    let animationFrameId;
    const animate = () => {
      // Slowly rotate particle coordinate system based on vector speeds
      const speedCoeff = isPlaying ? playbackSpeed : 0.2;
      particleSystem.rotation.y += 0.003 * speedCoeff;
      particleSystem.rotation.x += 0.001 * speedCoeff;

      // Animate particles based on current motion vectors mock intensities
      const pos = particleSystem.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        // Shift Z coordinate dynamically to represent flow depth
        pos[i * 3 + 2] += Math.sin((Date.now() * 0.001) + i) * 0.1 * speedCoeff;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // 4. Handle resize callback
    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isPlaying, playbackSpeed]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 text-left h-full">
        {/* TOP HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-display font-extrabold tracking-wider text-cyber-highlight">
              VISUALIZATION STUDIO
            </h2>
            <p className="text-xs text-cyber-text tracking-wide mt-1">
              Analyze multi-frame optical flows and intermediate synthesized frame details.
            </p>
          </div>
          {project && (
            <div className="hidden md:flex items-center gap-4 text-xs font-display tracking-widest bg-cyber-card border border-cyber-border rounded-xl px-4 py-2.5">
              <span className="text-cyber-text">PIPELINE:</span>
              <span className="text-cyber-accent font-bold">{project.name}</span>
            </div>
          )}
        </div>

        {/* WORKSPACE WORKBENCH GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-stretch">
          {/* VISUALIZER DUAL CANVASES */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            <div className="relative aspect-video rounded-3xl overflow-hidden glass-panel border border-cyber-accent/20 bg-black/40 flex items-center justify-center">
              {/* Preloader overlay */}
              {isPreloading && (
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-4">
                  <div className="relative w-20 h-20 rounded-full border-4 border-cyber-accent/10 border-t-cyber-accent animate-spin flex items-center justify-center shadow-glow-cyan">
                    <span className="text-[10px] font-display font-bold text-cyber-accent">{preloadingProgress}%</span>
                  </div>
                  <div className="text-[10px] font-display font-bold tracking-widest text-cyber-accent animate-pulse">
                    PRELOADING HIGH-FREQUENCY CACHE...
                  </div>
                </div>
              )}

              {/* WebGL Three.js Particle Mesh Overlay */}
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70" />

              {/* BACKGROUND REFERENCE FRAME SKETCHES */}
              <div 
                className="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-cover bg-center"
                style={{ 
                  transform: `scale(${zoomLevel})`,
                  backgroundImage: `radial-gradient(ellipse_at_center, rgba(16, 18, 27, 0.4), rgba(10, 11, 16, 0.95))`
                }}
              >
                {/* Optical Flow Vector arrows overlay */}
                {showVectors && (
                  <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none opacity-80">
                    {motionVectors.map((v, i) => (
                      <g key={i}>
                        {/* Render flow arrows */}
                        <line 
                          x1={v.x * 2} y1={v.y * 2} 
                          x2={(v.x + v.dx) * 2} y2={(v.y + v.dy) * 2} 
                          stroke={showHeatmap ? "#ff0844" : "#00f2fe"} 
                          strokeWidth="1.2" 
                        />
                        <circle cx={(v.x + v.dx) * 2} cy={(v.y + v.dy) * 2} r="1.5" fill="#ffffff" />
                      </g>
                    ))}
                  </svg>
                )}

                {/* Real Dynamic Frame Sequence with glowing text fallback */}
                {!imageLoadError ? (
                  <img 
                    src={showHeatmap 
                      ? `/media/optical_flow/${projectId}/flow_${String(currentFrame).padStart(4, '0')}_to_${String(currentFrame + 1).padStart(4, '0')}.png`
                      : `/media/interpolated_frames/${projectId}/interp_${String(currentFrame).padStart(5, '0')}.png`
                    }
                    onError={() => setImageLoadError(true)}
                    onLoad={() => setImageLoadError(false)}
                    alt="Visualization Stream"
                    className="w-full h-full object-contain max-h-[85%] rounded-2xl border border-cyber-accent/20 shadow-glow-cyan"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-6">
                    <div className="text-9xl font-display font-extrabold text-cyber-accent/10 select-none tracking-widest animate-pulse-slow">
                      FRAME_{String(currentFrame).padStart(4, '0')}
                    </div>
                    <div className="text-[10px] font-display font-bold tracking-widest text-cyber-accent bg-cyber-accent/10 border border-cyber-accent/30 px-4 py-2 rounded-xl shadow-glow-cyan">
                      SYNTHESIZED SUB-PIXEL COMPONENT
                    </div>
                  </div>
                )}
              </div>

              {/* FLOATING OVERLAY DIAGNOSTIC READOUT */}
              <div className="absolute top-6 left-6 p-4 rounded-xl glass-panel text-left flex flex-col gap-2 font-mono text-[9px] text-cyber-text select-none z-20">
                <span className="text-cyber-accent font-semibold flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-cyber-accent animate-ping" />
                  <span>LIVE SEQUENCE TELEMETRY</span>
                </span>
                <span>COORD RANGE: 48.254N, 16.321E</span>
                <span>FPS RESOLUTION: {project ? project.frame_rate * project.interpolation_factor : 60}Hz</span>
                <span>INTERMEDIATE: STEP {currentFrame % 4}/4</span>
              </div>
            </div>

            {/* PLAYBACK CONTROLS PANEL */}
            <div className="p-6 rounded-2xl glass-panel flex flex-col md:flex-row justify-between items-center gap-6 select-none">
              {/* PLAYBACK TRIGGERS */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentFrame(prev => Math.max(0, prev - 1))}
                  className="p-3 rounded-xl bg-white/5 border border-cyber-border hover:border-cyber-accent hover:text-cyber-highlight transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-4 rounded-full bg-gradient-neon border border-cyber-accent text-cyber-bg hover:text-cyber-highlight transition-all duration-300 shadow-md hover:shadow-glow-cyan flex items-center justify-center"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
                <button 
                  onClick={() => setCurrentFrame(prev => Math.min(maxFrame - 1, prev + 1))}
                  className="p-3 rounded-xl bg-white/5 border border-cyber-border hover:border-cyber-accent hover:text-cyber-highlight transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* TIMELINE SLIDER TRACK */}
              <div className="flex-1 w-full flex items-center gap-4">
                <span className="text-[10px] font-display font-semibold text-cyber-text">00:00</span>
                <div className="flex-grow relative py-2">
                  <input 
                    type="range" 
                    min="0" 
                    max={maxFrame - 1} 
                    value={currentFrame} 
                    onChange={(e) => setCurrentFrame(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyber-accent"
                  />
                  {/* Floating active tracker bubble */}
                  <div 
                    className="absolute -top-1.5 w-1 h-4 bg-cyber-accent rounded-full pointer-events-none shadow-glow-cyan"
                    style={{ left: `${(currentFrame / (maxFrame - 1 || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-display font-semibold text-cyber-accent">FRAME {currentFrame}/{maxFrame - 1}</span>
              </div>

              {/* CONTROL METRICS OVERLAY */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                  className="p-2.5 rounded-lg border border-cyber-border hover:border-cyber-accent text-cyber-text hover:text-cyber-highlight transition-all"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                  className="p-2.5 rounded-lg border border-cyber-border hover:border-cyber-accent text-cyber-text hover:text-cyber-highlight transition-all"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => { setZoomLevel(1); setCurrentFrame(0); }}
                  className="p-2.5 rounded-lg border border-cyber-border hover:border-cyber-accent text-cyber-text hover:text-cyber-highlight transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* STUDIO METRIC CONTROL COLUMN */}
          <div className="flex flex-col gap-6">
            {/* VECTOR DENSE CONTROL PANEL */}
            <div className="p-6 rounded-2xl glass-panel flex flex-col gap-6 text-left flex-1">
              <h3 className="text-sm font-display font-semibold text-cyber-highlight tracking-widest border-b border-cyber-border pb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyber-accent" />
                <span>OVERLAY SETTINGS</span>
              </h3>

              {/* OPTICAL FLOW OVERLAY CHECK */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-display font-semibold text-cyber-highlight">SPATIAL MOTION VECTOR</span>
                  <span className="text-[9px] text-cyber-text/80">Display sub-pixel arrows</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={showVectors}
                  onChange={() => setShowVectors(!showVectors)}
                  className="w-4 h-4 rounded text-cyber-accent bg-cyber-bg border-cyber-border accent-cyber-accent focus:ring-0 cursor-pointer"
                />
              </div>

              {/* FLUID VECTOR HEATMAP ACCENT */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-display font-semibold text-cyber-highlight">FLOW COLOR HEATMAP</span>
                  <span className="text-[9px] text-cyber-text/80">Toggle dense HSV coloring</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={showHeatmap}
                  onChange={() => setShowHeatmap(!showHeatmap)}
                  className="w-4 h-4 rounded text-cyber-accent bg-cyber-bg border-cyber-border accent-cyber-accent focus:ring-0 cursor-pointer"
                />
              </div>

              {/* SPEED TUNING SELECT */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-display tracking-widest text-cyber-accent font-semibold">PLAYBACK INTENSITY</label>
                <div className="grid grid-cols-4 gap-2">
                  {[0.25, 0.5, 1, 2].map((sp) => (
                    <button
                      key={sp}
                      onClick={() => setPlaybackSpeed(sp)}
                      className={`py-2 rounded-lg font-mono text-xs font-bold border transition-all duration-300 ${
                        playbackSpeed === sp 
                          ? 'bg-gradient-neon border-cyber-accent text-cyber-bg shadow-glow-cyan' 
                          : 'border-cyber-border bg-black/25 text-cyber-text hover:bg-white/5'
                      }`}
                    >
                      {sp}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* QUICK AI DIAGNOSTIC REPORT CARD */}
            <div className="p-6 rounded-2xl glass-panel flex flex-col gap-4 text-left">
              <span className="text-[10px] font-display font-semibold tracking-widest text-cyber-highlight flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyber-accent" />
                <span>AI SYNTHESIS LOG</span>
              </span>
              <div className="flex flex-col gap-2.5 font-mono text-[9px] text-cyber-text/80 leading-normal">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>SSIM SCORE:</span>
                  <span className="text-emerald-400 font-bold">0.9654</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>PSNR RATIO:</span>
                  <span className="text-emerald-400 font-bold">34.82dB</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>MOTION MAGNITUDE:</span>
                  <span className="text-cyber-accent font-bold">4.24 px</span>
                </div>
                <div className="flex justify-between">
                  <span>WARPING TIME:</span>
                  <span className="text-cyber-accent font-bold">14.2ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
