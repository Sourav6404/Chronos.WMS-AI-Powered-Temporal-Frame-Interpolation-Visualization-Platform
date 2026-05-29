import React, { useEffect, useState } from 'react';
import { LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart as ReBarChart, Bar } from 'recharts';
import { BarChart3, LineChart, Cpu, ShieldCheck, Activity, TrendingUp } from 'lucide-react';
import { analyticsService } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';

export default function AnalyticsPage() {
  const [report, setReport] = useState(null);
  const [psnrCurve, setPsnrCurve] = useState([]);
  const [ssimCurve, setSsimCurve] = useState([]);

  useEffect(() => {
    const loadReport = async () => {
      const data = await analyticsService.getProjectReport(1);
      setReport(data);

      // Generate simulated sequential frame-by-frame curves
      const psnrs = [];
      const ssims = [];
      for (let i = 0; i < 20; i++) {
        // Higher frequencies represent motion displacements
        const variance = Math.sin(i * 0.5) * 1.8 + Math.cos(i * 0.8) * 0.5;
        psnrs.push({ frame: `F_${i}`, value: parseFloat((32.4 + variance).toFixed(2)) });
        ssims.push({ frame: `F_${i}`, value: parseFloat((0.95 + variance * 0.005).toFixed(4)) });
      }
      setPsnrCurve(psnrs);
      setSsimCurve(ssims);
    };
    loadReport();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-8 text-left">
        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-display font-extrabold tracking-wider text-cyber-highlight">
            ANALYTICS CONSOLE
          </h2>
          <p className="text-xs text-cyber-text tracking-wide mt-1">
            Telemetry metrics, Peak Signal-to-Noise Ratio (PSNR), and Structural Similarity (SSIM) profiles.
          </p>
        </div>

        {report && (
          <>
            {/* GRID OF COUNTERS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl glass-panel text-left">
                <span className="text-[10px] font-display font-semibold tracking-widest text-cyber-text/60">MEAN PSNR RATIO</span>
                <div className="text-2xl font-display font-bold text-cyber-accent mt-3">{report.average_psnr.toFixed(2)} dB</div>
              </div>
              <div className="p-6 rounded-2xl glass-panel text-left">
                <span className="text-[10px] font-display font-semibold tracking-widest text-cyber-text/60">MEAN SSIM INDEX</span>
                <div className="text-2xl font-display font-bold text-emerald-400 mt-3">{report.average_ssim.toFixed(4)}</div>
              </div>
              <div className="p-6 rounded-2xl glass-panel text-left">
                <span className="text-[10px] font-display font-semibold tracking-widest text-cyber-text/60">INFERENCE SPEED</span>
                <div className="text-2xl font-display font-bold text-cyber-purple mt-3">{report.processing_speed_fps.toFixed(1)} FPS</div>
              </div>
              <div className="p-6 rounded-2xl glass-panel text-left">
                <span className="text-[10px] font-display font-semibold tracking-widest text-cyber-text/60">VRAM FOOTPRINT</span>
                <div className="text-2xl font-display font-bold text-cyber-pink mt-3">{report.gpu_memory_used_gb.toFixed(2)} GB</div>
              </div>
            </div>

            {/* CURVES GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PSNR CURVE */}
              <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between min-h-[300px]">
                <h3 className="text-sm font-display font-semibold text-cyber-highlight tracking-widest mb-6 flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-cyber-accent" />
                  <span>FRAME-BY-FRAME PSNR DEVIATION</span>
                </h3>
                <div className="w-full h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart data={psnrCurve} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="frame" stroke="#525870" style={{ fontSize: '9px', fontFamily: 'Orbitron' }} />
                      <YAxis stroke="#525870" domain={[28, 38]} style={{ fontSize: '9px', fontFamily: 'Orbitron' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#10121b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '11px' }} />
                      <Line type="monotone" dataKey="value" stroke="#00f2fe" strokeWidth={2} dot={false} />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* SSIM CURVE */}
              <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between min-h-[300px]">
                <h3 className="text-sm font-display font-semibold text-cyber-highlight tracking-widest mb-6 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>TEMPORAL SSIM STRUCTURAL ALIGNMENT</span>
                </h3>
                <div className="w-full h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart data={ssimCurve} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="frame" stroke="#525870" style={{ fontSize: '9px', fontFamily: 'Orbitron' }} />
                      <YAxis stroke="#525870" domain={[0.92, 1.0]} style={{ fontSize: '9px', fontFamily: 'Orbitron' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#10121b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '11px' }} />
                      <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} dot={false} />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
