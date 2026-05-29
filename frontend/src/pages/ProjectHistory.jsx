import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, Eye, Trash2, Calendar, FileClock, CheckCircle, Hourglass } from 'lucide-react';
import { projectService } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';

export default function ProjectHistory() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const loadProjects = async () => {
      const projs = await projectService.list();
      setProjects(projs);
    };
    loadProjects();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' @ ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto flex flex-col gap-8 text-left">
        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-display font-extrabold tracking-wider text-cyber-highlight">
            PROJECT HISTORY
          </h2>
          <p className="text-xs text-cyber-text tracking-wide mt-1">
            Browse and query previous spatial sequence frame-interpolation runs.
          </p>
        </div>

        {/* PROJECTS GORGEOUS LIST */}
        <div className="p-6 rounded-2xl glass-panel flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-display font-bold text-cyber-highlight tracking-widest border-b border-cyber-border pb-3">
            <FileClock className="w-4 h-4 text-cyber-accent" />
            <span>HISTORICAL TELEMETRY JOBS ({projects.length})</span>
          </div>

          <div className="flex flex-col gap-4">
            {projects.map((proj, idx) => (
              <div 
                key={idx} 
                className="p-6 rounded-xl bg-black/20 border border-cyber-border hover:border-cyber-accent/40 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                {/* PROJECT NAME & DATE */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-base font-display font-bold text-cyber-highlight hover:text-cyber-accent transition-colors">
                    <Link to={`/studio?project=${proj.id}`}>{proj.name}</Link>
                  </h4>
                  <div className="flex items-center gap-4 text-[10px] text-cyber-text/60 font-display">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formatDate(proj.created_at)}</span>
                    <span>•</span>
                    <span>MULTIPLIER: {proj.interpolation_factor}x</span>
                  </div>
                </div>

                {/* PROJECT STATS & LINKS */}
                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-[9px] text-cyber-text/50 font-display font-semibold tracking-widest">UPSCALER</span>
                    <span className="text-xs font-display font-bold text-cyber-highlight">{proj.selected_model}</span>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-display font-semibold ${
                    proj.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    proj.status === 'PROCESSING' ? 'bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 animate-pulse' :
                    'bg-cyber-pink/10 text-cyber-pink border border-cyber-pink/30'
                  }`}>
                    {proj.status === 'COMPLETED' ? <CheckCircle className="w-3.5 h-3.5" /> : <Hourglass className="w-3.5 h-3.5" />}
                    {proj.status}
                  </span>

                  <Link 
                    to={`/studio?project=${proj.id}`}
                    className="p-2.5 rounded-xl border border-cyber-border hover:border-cyber-accent text-cyber-text hover:text-cyber-highlight transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
