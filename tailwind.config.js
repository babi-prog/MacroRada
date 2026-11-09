/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        terminal: {
          dark: '#08090b',
          card: 'rgba(18, 20, 26, 0.7)',
          border: 'rgba(39, 44, 53, 0.8)',
          subtle: '#27272a',
        },
        impact: {
          high: '#ef4444',
          medium: '#f59e0b',
          low: '#71717a',
        }
      },
      boxShadow: {
        'glow-red': '0 0 15px -3px rgba(239, 68, 68, 0.4)',
        'glow-amber': '0 0 15px -3px rgba(245, 158, 11, 0.4)',
        'glow-green': '0 0 15px -3px rgba(16, 185, 129, 0.4)',
        'glow-cyan': '0 0 15px -3px rgba(6, 182, 212, 0.4)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
