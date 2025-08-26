import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom theme colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Tier colors
        tier: {
          bronze: '#cd7f32',
          silver: '#c0c0c0',
          gold: '#ffd700',
          platinum: '#e5e4e2',
          diamond: '#b9f2ff',
          master: '#ff6b6b',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Monaco', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 1s ease-in-out 3',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': {
            boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)',
          },
          '100%': {
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)',
          },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      // Responsive breakpoints for adaptive design
      screens: {
        'xs': '475px',
        'fold': '512px', // Foldable phones
        'tablet-sm': '640px', // Small tablets
        'tablet': '768px', // Standard tablets
        'tablet-lg': '1024px', // Large tablets
        'desktop': '1280px', // Desktop
        'desktop-lg': '1440px', // Large desktop
        'desktop-xl': '1920px', // Extra large desktop
      },
    },
  },
  plugins: [
    // Custom plugin for typing effects
    function({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.typing-cursor': {
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-2px',
            left: '0',
            width: '100%',
            height: '2px',
            backgroundColor: 'currentColor',
            animation: 'pulse 1s infinite',
          },
        },
        '.typing-glow': {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
          },
        },
        '.mobile-adaptive': {
          '@screen max-fold': {
            padding: '1rem',
          },
          '@screen fold': {
            padding: '1.5rem',
          },
        },
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;