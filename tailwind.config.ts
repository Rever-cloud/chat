import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        black: '#050505',
        darkred: '#120202',
        neonred: '#ff1e1e',
        surface: 'rgba(255,255,255,0.05)',
        borderglow: 'rgba(255,30,30,0.2)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0,0,0,0.37)',
        'neon': '0 0 20px rgba(255,30,30,0.3), 0 0 40px rgba(255,30,30,0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'drift': 'drift 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(10px, -10px)' },
          '50%': { transform: 'translate(-5px, 5px)' },
          '75%': { transform: 'translate(10px, -5px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
