/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0a0b10",
          card: "rgba(16, 18, 27, 0.4)",
          accent: "#00f2fe",
          purple: "#4facfe",
          pink: "#ff0844",
          border: "rgba(255, 255, 255, 0.08)",
          text: "#a0a5b5",
          highlight: "#ffffff"
        }
      },
      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        'gradient-neon': 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
        'gradient-purple': 'linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(0, 242, 254, 0.35)',
        'glow-purple': '0 0 15px rgba(127, 0, 255, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
