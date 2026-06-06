import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for injecting simple JWT authorization tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh handling or fallback redirects
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const res = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh: refreshToken });
        if (res.status === 200) {
          localStorage.setItem('access_token', res.data.access);
          api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
          return api(originalRequest);
        }
      } catch (err) {
        // Log out user if refresh fails
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    return Promise.reject(error);
  }
);

// MOCK DATA FOR OUT-OF-THE-BOX FALLBACK MODE
const mockStats = {
  active_projects: 3,
  processing_queue: 1,
  fps_improvement: 2.4,
  ai_accuracy_score: 95.8,
  average_psnr: 34.2,
  gpu_usage_pct: 42.0,
  processing_time_avg_sec: 12.4
};

const mockProjects = [
  {
    id: 1,
    name: "WMS Sentinel Temperature Flow Sequence",
    description: "Temporal smoothing for climate model temperature shifts over a 12-month sequence.",
    status: "COMPLETED",
    created_at: "2026-05-24T12:00:00Z",
    frame_rate: 15,
    interpolation_factor: 4,
    selected_model: "RIFE",
    progress: 100,
    original_video_url: null,
    interpolated_video_url: null,
    uploaded_files: []
  },
  {
    id: 2,
    name: "SAR Coastal Wave Motion Interpolation",
    description: "Interpolating sequential synthetic aperture radar coastal scans for fluid vectors.",
    status: "PROCESSING",
    created_at: "2026-05-24T20:15:00Z",
    frame_rate: 10,
    interpolation_factor: 2,
    selected_model: "FILM",
    progress: 45,
    original_video_url: null,
    interpolated_video_url: null,
    uploaded_files: []
  }
];

export const authService = {
  login: async (username, password) => {
    try {
      const res = await api.post('/auth/login/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      return res.data;
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        // Fallback for demo when backend is not running
        localStorage.setItem('access_token', 'mock_token_abc123');
        return { access: 'mock_token', refresh: 'mock_refresh', user: { username } };
      }
      throw err;
    }
  },
  register: async (username, email, password) => {
    try {
      const res = await api.post('/auth/register/', { username, email, password });
      return res.data;
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        return { message: "Mock registration successful for demo." };
      }
      throw err;
    }
  },
  getProfile: async () => {
    try {
      const res = await api.get('/auth/profile/');
      return res.data;
    } catch (err) {
      return { username: "Guest Researcher", email: "guest@wms.ai", dark_mode: true, gpu_allocation_limit: 8.0 };
    }
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const projectService = {
  list: async () => {
    try {
      const res = await api.get('/projects/');
      return res.data;
    } catch (err) {
      return mockProjects;
    }
  },
  get: async (id) => {
    try {
      const res = await api.get(`/projects/${id}/`);
      return res.data;
    } catch (err) {
      return mockProjects.find(p => p.id === Number(id)) || mockProjects[0];
    }
  },
  create: async (projectData) => {
    try {
      const res = await api.post('/projects/', projectData);
      return res.data;
    } catch (err) {
      const newProj = {
        id: mockProjects.length + 1,
        ...projectData,
        status: 'CREATED',
        progress: 0,
        created_at: new Date().toISOString(),
        uploaded_files: []
      };
      mockProjects.unshift(newProj);
      return newProj;
    }
  },
  uploadFile: async (projectId, file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post(`/projects/${projectId}/upload-file/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress
      });
      return res.data;
    } catch (err) {
      return { id: Math.random(), filename: file.name, file: URL.createObjectURL(file) };
    }
  }
};

export const processingService = {
  interpolate: async (projectId) => {
    try {
      const res = await api.post('/processing/interpolate/', { project_id: projectId });
      return res.data;
    } catch (err) {
      const proj = mockProjects.find(p => p.id === Number(projectId));
      if (proj) {
        proj.status = 'PROCESSING';
        proj.progress = 0;
      }
      return { id: 999, project: projectId, status: 'PROCESSING', progress: 0, logs: "Mock processing initiated..." };
    }
  },
  getStatus: async (jobId) => {
    try {
      const res = await api.get(`/processing/job/${jobId}/`);
      return res.data;
    } catch (err) {
      return { status: 'COMPLETED', progress: 100, logs: "Interpolation complete." };
    }
  },
  getOpticalFlow: async (projectId, frameIndex) => {
    try {
      const res = await api.post('/processing/optical-flow/', { project_id: projectId, frame_index: frameIndex });
      return res.data;
    } catch (err) {
      // Mock flow vector grids for WebGL rendering
      const vectors = [];
      for (let y = 0; y < 300; y += 20) {
        for (let x = 0; x < 400; x += 20) {
          const angle = (x * 0.01) + (y * 0.02);
          vectors.push({
            x, y,
            dx: Math.cos(angle) * 8 * Math.sin(frameIndex + 1),
            dy: Math.sin(angle) * 8 * Math.cos(frameIndex + 1)
          });
        }
      }
      return { project_id: projectId, frame_index: frameIndex, average_magnitude: 4.8, motion_vectors: vectors };
    }
  }
};

export const analyticsService = {
  getSystemStats: async () => {
    try {
      const res = await api.get('/analytics/system-stats/');
      return res.data;
    } catch (err) {
      return mockStats;
    }
  },
  getProjectReport: async (projectId) => {
    try {
      const res = await api.get(`/analytics/project/${projectId}/`);
      return res.data;
    } catch (err) {
      return {
        project: projectId,
        average_psnr: 32.4 + Math.random(),
        average_ssim: 0.94 + Math.random() * 0.03,
        motion_intensity: 6.2,
        processing_speed_fps: 14.5,
        gpu_memory_used_gb: 2.4,
        frame_smoothness_index: 0.96,
        model_confidence_score: 0.94
      };
    }
  }
};
