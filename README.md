# Chronos: AI-Powered Frame Interpolation for Temporal Visualization in WMS

Chronos is a cutting-edge, premium full-stack AI-powered web application built to address temporal gaps and aliasing in sequence scans and Web Map Services (WMS). It allows researchers to upload sequential frames or videos, perform advanced optical flow and motion-warping frame interpolation (up to 8x slow-motion / double/quadruple FPS upscaling), examine sub-pixel motion vectors using 3D WebGL (Three.js), and analyze structural similarity metrics (SSIM/PSNR).

Inspired by **NVIDIA AI Research**, **RunwayML**, and **Tesla's visualization networks**.

---

## 🚀 Recommended First Step: Set Active Workspace

To run the commands easily and interact with the terminal in your IDE, please set this directory as your active workspace:
👉 **`C:\Users\ACER\.gemini\antigravity-ide\scratch\wms-frame-interpolation`**

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion + Recharts + Three.js
- **Backend**: Django + Django REST Framework + PostgreSQL/SQLite + PyTorch + OpenCV
- **Task Queue**: Celery + Redis (with a robust **native multi-threaded queue runner fallback** built directly into Django so that the system operates out of the box without requiring a running Redis server).

---

## 📂 Project Structure

```
wms-frame-interpolation/
├── backend/
│   ├── apps/
│   │   ├── authentication/   # Custom user profile, JWT security
│   │   ├── projects/         # Project metadata, files uploads
│   │   ├── processing/       # PyTorch, optical flow & warp interpolator
│   │   └── analytics/        # Peak Signal-to-Noise, SSIM scoring
│   ├── core/                 # Django settings, URLs, Celery setup
│   ├── db.sqlite3            # Fully migrated SQLite database
│   ├── manage.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/       # BackgroundParticles canvas, Glass Navbar
    │   ├── layouts/          # DashboardLayout sidebar frame
    │   ├── pages/            # Landing, Studio, AIModels, Analytics, History
    │   ├── services/         # api.js with JWT preloads and offline mockup fallbacks
    │   ├── index.css         # Customized design system stylesheet
    │   └── main.jsx
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 💻 Running the Application

### 1. Backend Setup (Django)

Make sure you are in the `backend/` directory:
```bash
cd backend
```

Create a virtual environment and install dependencies:
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Start the Django development server (runs on `http://127.0.0.1:8000`):
```bash
python manage.py runserver
```

*(Note: The database is already fully migrated for you!)*

### 2. Frontend Setup (React + Vite)

Make sure you are in the `frontend/` directory:
```bash
cd ../frontend
```

Install node packages:
```bash
npm install
```

Start the Vite development server (runs on `http://localhost:3000` with direct proxy routing to Django):
```bash
npm run dev
```

---

## 🌟 Premium System Features

1. **Before/After Motion Slider**: Drag horizontally to visually compare low-frequency original gaps with continuous upscaled AI outputs.
2. **Dense Optical Flow & WebGL Overlay**: Switch on sub-pixel motion vectors drawn over custom sequence frames. An interactive 3D particle field rotates dynamically using Three.js relative to movement intensities.
3. **Double Fallback Queue**: Runs complex forward-warping optical flow computations directly on thread pools if Celery/Redis is not activated.
4. **Futuristic Cyberpunk Aesthetic**: High-blur glassmorphic overlays, vibrant cyber neon gradient accents, and Outfit/Orbitron typography.
