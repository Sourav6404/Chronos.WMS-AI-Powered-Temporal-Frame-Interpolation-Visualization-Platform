import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import VisualizationStudio from './pages/VisualizationStudio';
import AIModelSelection from './pages/AIModelSelection';
import AnalyticsPage from './pages/AnalyticsPage';
import ProjectHistory from './pages/ProjectHistory';
import SettingsPage from './pages/SettingsPage';

// A simple PrivateRoute gate component to protect dashboard routes
function PrivateRoute({ children }) {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cyber-bg text-cyber-text flex flex-col justify-between selection:bg-cyber-accent selection:text-cyber-bg relative z-10">
        <Navbar />
        
        <div className="flex-1 w-full flex flex-col justify-between">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/demo" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* PROTECTED PIPELINE CONSOLE ROUTES */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
            <Route path="/studio" element={<PrivateRoute><VisualizationStudio /></PrivateRoute>} />
            <Route path="/models" element={<PrivateRoute><AIModelSelection /></PrivateRoute>} />
            <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><ProjectHistory /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />

            {/* FALLBACK REDIRECT */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
