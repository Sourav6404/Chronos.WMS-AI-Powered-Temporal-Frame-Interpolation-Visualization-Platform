import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderGit2, Cpu, LineChart, ShieldCheck, Play, ArrowUpRight, 
  Hourglass, CheckCircle2, ChevronRight, Activity, PlusCircle 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsService, projectService } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const systemStats = await analyticsService.getSystemStats();
      setStats(systemStats);
      
      const projs = await projectService.list();
      setProjects(projs.slice(0, 5));

      // Generate futuristic charting wave points
      setChartData([
        { name: '00:00', load: 15, accuracy: 92 },
        { name: '04:00', load: 38, accuracy: 94 },
        { name: '08:00', load: 72, accuracy: 95 },
        { name: '12:00', load: 55, accuracy: 94 },
        { name: '16:00', load: 88, accuracy: 96 },
        { name: '20:00', load: 45, accuracy: 97 },
        { name: '24:00', load: stats?.gpu_usage_pct || 30, accuracy: 95.8 },
      ]);
    };
    loadDashboardData();
  }, []);

  const widgetCards = stats ? [
    { label: "ACTIVE PROJECTS", value: stats.active_projects, icon: FolderGit2, color: "text-cyber-accent", glow: "shadow-glow-cyan" },
    { label: "QUEUED JOBS", value: stats.processing_queue, icon: Hourglass, color: "text-amber-400", glow: "rgba(251, 191, 36, 0.15)" },
    { label: "SYNTHESIS SPEED", value: `${stats.fps_improvement.toFixed(1)}x`, icon: Cpu, color: "text-cyber-purple", glow: "shadow-glow-purple" },
    { label: "AI SSIM QUALITY", value: `${stats.ai_accuracy_score.toFixed(1)}%`, icon: ShieldCheck, color: "text-emerald-400", glow: "rgba(52, 211, 153, 0.15)" }
  ] : [];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 text-left">
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-display font-extrabold tracking-wider text-cyber-highlight">
              RESEARCH DESK
            </h2>
            <p className="text-xs text-cyber-text tracking-wide mt-1">
              Cluster Node telemetry, spatial queue, and temporal vector processing metrics.
            </p>
          </div>
          <Link 
            to="/upload" 
            className="bg-gradient-neon border border-cyber-accent hover:border-white text-cyber-bg hover:text-cyber-highlight px-5 py-3 rounded-xl text-xs font-bold tracking-widest font-display transition-all duration-300 shadow-md hover:shadow-glow-cyan flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>NEW PIPELINE</span>
          </Link>
        </div>

        {/* METRIC CARD GRID */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {widgetCards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl glass-panel relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-display font-semibold tracking-widest text-cyber-text/60">
                      {card.label}
                    </span>
                    <IconComp className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <div className="text-3xl font-display font-extrabold text-cyber-highlight mt-4 select-none">
                    {card.value}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-[2px] bg-cyber-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-glow-cyan" />
                </div>
              );
            })}
          </div>
        )}

        {/* MIDDLE SECTION: MAIN TELEMETRY CHART */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 p-6 rounded-2xl glass-panel flex flex-col justify-between min-h-[350px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-display font-semibold text-cyber-highlight tracking-widest flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-cyber-accent" />
                  <span>CLUSTER LOAD & ACCURACY RESPONSE</span>
                </h3>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-display font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyber-accent" /> GPU LOAD</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyber-pink" /> ACCURACYSSIM</span>
              </div>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff0844" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#ff0844" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#525870" style={{ fontSize: '10px', fontFamily: 'Orbitron' }} />
                  <YAxis stroke="#525870" style={{ fontSize: '10px', fontFamily: 'Orbitron' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#10121b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="load" stroke="#00f2fe" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" />
                  <Area type="monotone" dataKey="accuracy" stroke="#ff0844" strokeWidth={2} fillOpacity={1} fill="url(#colorAcc)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ACTIVE QUEUE LOG STREAM */}
          <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-display font-semibold text-cyber-highlight tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyber-pink" />
                <span>SPATIAL CONSOLE LOG</span>
              </h3>
            </div>

            <div className="flex-1 flex flex-col gap-4 font-mono text-[10px] text-cyber-text/80 bg-black/35 rounded-xl border border-cyber-border p-4 h-64 overflow-y-auto overflow-x-hidden leading-normal">
              <div>[SYSTEM] Node initialization Chronos // successful.</div>
              <div>[GPU] Allocation capacity: 8.00GB // active.</div>
              <div>[WMS] Sentinel 2 pipeline active gap 12 -{">"} loaded.</div>
              <div>[AI ENGINE] Loaded RIFE weights in CUDA index 0.</div>
              <div className="text-cyber-accent">[FLOW] Lucas-Kanade local motion computation ok.</div>
              <div className="text-emerald-400">[SUCCESS] Generated boundary intermediate frame 0048.</div>
              <div className="text-cyber-pink">[WARN] CUDA block execution time threshold: 12ms.</div>
              <div className="animate-pulse">_ blinking cursor console active</div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: PROJECT LISTING */}
        <div className="p-6 rounded-2xl glass-panel">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-display font-semibold text-cyber-highlight tracking-widest">
              RECENT SPATIAL PIPELINES
            </h3>
            <Link to="/history" className="text-xs font-display font-bold text-cyber-accent hover:underline flex items-center gap-1">
              <span>EXPLORE ALL</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-black/25 border border-cyber-border hover:border-cyber-accent/40 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                <div className="flex flex-col gap-1.5 max-w-md">
                  <h4 className="text-sm font-display font-semibold text-cyber-highlight hover:text-cyber-accent transition-colors">
                    <Link to={`/studio?project=${proj.id}`}>{proj.name}</Link>
                  </h4>
                  <p className="text-xs text-cyber-text/85 line-clamp-1">
                    {proj.description || "No project description provided."}
                  </p>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-[10px] text-cyber-text/50 font-display font-semibold tracking-widest">MODEL</span>
                    <span className="text-xs font-display font-bold text-cyber-highlight">{proj.selected_model}</span>
                  </div>

                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-[10px] text-cyber-text/50 font-display font-semibold tracking-widest">PROGRESS</span>
                    <span className="text-xs font-display font-bold text-cyber-accent">{proj.progress}%</span>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-display font-semibold ${
                    proj.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    proj.status === 'PROCESSING' ? 'bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 animate-pulse' :
                    'bg-cyber-pink/10 text-cyber-pink border border-cyber-pink/30'
                  }`}>
                    {proj.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : <Hourglass className="w-3 h-3" />}
                    {proj.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
