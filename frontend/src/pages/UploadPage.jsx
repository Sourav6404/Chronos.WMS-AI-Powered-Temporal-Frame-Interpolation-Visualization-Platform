import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileVideo, FileImage, ShieldAlert, CheckCircle, ArrowRight, Play, Eye } from 'lucide-react';
import { projectService, processingService } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';

export default function UploadPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [model, setModel] = useState('RIFE');
  const [factor, setFactor] = useState(2);
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [step, setStep] = useState(1); // 1: Config & Select, 2: Uploading & Extraction
  const [extractedFrames, setExtractedFrames] = useState([]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndAddFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndAddFiles(selectedFiles);
  };

  const validateAndAddFiles = (selectedFiles) => {
    const validFiles = selectedFiles.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      return ['mp4', 'avi', 'mov', 'png', 'jpg', 'jpeg', 'tiff'].includes(ext);
    });

    if (validFiles.length < selectedFiles.length) {
      alert("Some files were skipped. Only MP4, AVI, PNG, JPG, or TIFF files are supported.");
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const startPipeline = async (e) => {
    e.preventDefault();
    if (!name) return alert("Please specify a pipeline identifier.");
    if (files.length === 0) return alert("Please load at least one video or frame sequence.");

    setLoading(true);
    setStep(2);
    setUploadProgress(10);

    try {
      // 1. Create the project
      const proj = await projectService.create({
        name,
        description: desc,
        selected_model: model,
        interpolation_factor: factor,
        frame_rate: 30
      });

      // 2. Upload file(s)
      setUploadProgress(30);
      const isSequence = files.length > 1 || !files[0].name.match(/\.(mp4|avi|mov)$/i);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await projectService.uploadFile(proj.id, file, (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          const chunkProgress = 30 + Math.round((percentCompleted * 40) / 100);
          setUploadProgress(chunkProgress);
        });

        // Simulate frame extraction listing for immediate visual feedback
        if (!isSequence) {
          setExtractedFrames([
            "frame_0001_extracted.png",
            "frame_0002_extracted.png",
            "frame_0003_extracted.png",
            "frame_0004_extracted.png",
            "frame_0005_extracted.png",
          ]);
        }
      }

      setUploadProgress(80);
      // 3. Initiate background interpolation job
      await processingService.interpolate(proj.id);
      
      setUploadProgress(100);
      setLoading(false);
      
      // Navigate straight to the visualization studio workspace
      setTimeout(() => {
        navigate(`/studio?project=${proj.id}`);
      }, 1500);

    } catch (err) {
      alert("Error starting pipeline: " + err.message);
      setLoading(false);
      setStep(1);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-8 text-left">
        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-display font-extrabold tracking-wider text-cyber-highlight">
            UPLOAD STUDIO
          </h2>
          <p className="text-xs text-cyber-text tracking-wide mt-1">
            Feed sequential raster sequences or dynamic videos into the AI motion upscaling grid.
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={startPipeline} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CONFIGURATION & DETAILS */}
            <div className="md:col-span-1 flex flex-col gap-6 p-6 rounded-2xl glass-panel">
              <h3 className="text-sm font-display font-semibold text-cyber-highlight tracking-widest border-b border-cyber-border pb-3">
                PIPELINE SETTINGS
              </h3>

              {/* PROJECT NAME */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-display tracking-widest text-cyber-accent font-semibold">IDENTIFIER</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sentinel_02_WMS_Scan"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-cyber-border text-xs text-cyber-highlight focus:outline-none focus:border-cyber-accent transition-all font-sans"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-display tracking-widest text-cyber-accent font-semibold">REMARKS</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="High resolution wave vectors smoothing."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-cyber-border text-xs text-cyber-highlight focus:outline-none focus:border-cyber-accent transition-all font-sans resize-none"
                />
              </div>

              {/* MODEL CONFIG */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-display tracking-widest text-cyber-accent font-semibold">AI UPSCALER MODEL</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-cyber-bg border border-cyber-border text-xs text-cyber-highlight focus:outline-none focus:border-cyber-accent transition-all font-sans"
                >
                  <option value="RIFE">RIFE v4.8 (Real-Time Flow)</option>
                  <option value="DAIN">DAIN (Depth-Aware Video)</option>
                  <option value="FILM">FILM (Large Scale Motion)</option>
                  <option value="SUPER_SLOMO">Super SloMo</option>
                </select>
              </div>

              {/* INTERPOLATION FACTOR */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-display tracking-widest text-cyber-accent font-semibold">UPSCALING MULTIPLIER</label>
                <select
                  value={factor}
                  onChange={(e) => setFactor(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-cyber-bg border border-cyber-border text-xs text-cyber-highlight focus:outline-none focus:border-cyber-accent transition-all font-sans"
                >
                  <option value={2}>2x Interpolation (Double FPS)</option>
                  <option value={4}>4x Interpolation (Quadruple FPS)</option>
                  <option value={8}>8x Interpolation (Extreme Slow)</option>
                </select>
              </div>
            </div>

            {/* DRAG AND DROP ZONE */}
            <div className="md:col-span-2 flex flex-col gap-6">
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`p-12 rounded-2xl border-2 border-dashed flex flex-col items-center gap-4 text-center cursor-pointer transition-all duration-300 ${
                  dragging 
                    ? 'border-cyber-accent bg-cyber-accent/5 shadow-glow-cyan' 
                    : 'border-cyber-border bg-black/20 hover:border-cyber-accent/40'
                }`}
              >
                <input
                  type="file"
                  multiple
                  id="file-select"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="file-select" className="flex flex-col items-center gap-4 cursor-pointer">
                  <div className="p-4 rounded-full bg-cyber-accent/10 border border-cyber-accent/30 text-cyber-accent group-hover:bg-cyber-accent transition-all duration-300">
                    <UploadCloud className="w-8 h-8 animate-bounce" />
                  </div>
                  <div>
                    <span className="font-display text-sm font-bold text-cyber-highlight">
                      DRAG & DROP SEQUENTIAL MEDIA
                    </span>
                    <p className="text-[10px] text-cyber-text tracking-widest mt-1">
                      SUPPORTED FORMATS: MP4, AVI, PNG, JPG, TIFF
                    </p>
                  </div>
                </label>
              </div>

              {/* FILES PREVIEW */}
              {files.length > 0 && (
                <div className="p-6 rounded-2xl glass-panel flex flex-col gap-4 max-h-72 overflow-y-auto">
                  <h4 className="text-xs font-display font-semibold tracking-wider text-cyber-highlight">
                    LOADED SELECTIONS ({files.length})
                  </h4>
                  <div className="flex flex-col gap-2">
                    {files.map((file, idx) => {
                      const isVideo = file.name.match(/\.(mp4|avi|mov)$/i);
                      return (
                        <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-cyber-border/40">
                          <div className="flex items-center gap-3">
                            {isVideo ? <FileVideo className="w-4 h-4 text-cyber-accent" /> : <FileImage className="w-4 h-4 text-cyber-purple" />}
                            <span className="text-xs font-mono text-cyber-highlight line-clamp-1">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="text-[10px] text-cyber-pink font-semibold hover:underline px-2"
                          >
                            REMOVE
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={files.length === 0}
                className="w-full bg-gradient-neon hover:bg-none hover:bg-cyber-accent text-cyber-bg hover:text-cyber-bg font-bold tracking-widest font-display text-sm py-4 rounded-xl shadow-lg hover:shadow-glow-cyan transition-all duration-300 flex items-center justify-center gap-3 mt-2 disabled:opacity-30 disabled:pointer-events-none"
              >
                <span>INITIATE TELEMETRY PIPELINE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* STEP 2: LOADING & PIPELINE EXECUTION SIMULATION */
          <div className="max-w-md mx-auto p-8 rounded-3xl glass-panel-glow border-cyber-accent/30 text-center flex flex-col gap-6">
            <div className="flex justify-center">
              <div className="relative p-6 rounded-full bg-cyber-accent/10 border border-cyber-accent/30">
                <UploadCloud className="w-10 h-10 text-cyber-accent animate-pulse" />
                <div className="absolute inset-0 bg-cyber-accent/20 blur rounded-full -z-10" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-display font-bold text-cyber-highlight">
                UPLOADING MEDIA SEGMENTS
              </h3>
              <p className="text-xs text-cyber-text tracking-wide mt-2">
                Assembling image frames and forwarding to Python PyTorch frame generator...
              </p>
            </div>

            {/* PROGRESS BAR */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[10px] font-display font-semibold text-cyber-accent">
                <span>PROGRESS</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-neon transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>

            {/* EXTRACTED PREVIEW (Simulated Frame Extraction Listing) */}
            {extractedFrames.length > 0 && (
              <div className="mt-4 flex flex-col gap-3 text-left">
                <span className="text-[10px] font-display font-semibold tracking-widest text-cyber-highlight flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyber-accent" />
                  <span>LIVE FRAME EXTRACTION PREVIEW</span>
                </span>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {extractedFrames.map((frame, index) => (
                    <div key={index} className="flex-shrink-0 w-24 aspect-video rounded border border-cyber-border bg-black/40 flex items-center justify-center font-mono text-[8px] text-cyber-accent">
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
