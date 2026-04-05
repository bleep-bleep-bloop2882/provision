/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5' },
        surface: { 950: '#07090f', 900: '#0d1117', 800: '#161b22', 700: '#1c2333', 600: '#21262d', 500: '#30363d' },
        success: { 400: '#4ade80', 500: '#22c55e' },
        warning: { 400: '#fbbf24' },
        danger:  { 400: '#f87171' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
