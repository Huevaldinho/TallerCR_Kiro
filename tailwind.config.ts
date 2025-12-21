import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Taller Pro CR Brand Colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3B82F6', // Main primary color
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        secondary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10B981', // Main secondary color
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Status colors for order states
        status: {
          borrador: '#eab308', // yellow-500
          enviada: '#3b82f6',  // blue-500 (primary)
          aprobada: '#10b981', // green-500 (secondary)
          facturada: '#6b7280', // gray-500
          completada: '#9ca3af', // gray-400
        },
        // Costa Rica specific colors
        cr: {
          blue: '#0038a8',    // Costa Rica flag blue
          red: '#ce1126',     // Costa Rica flag red
          white: '#ffffff',   // Costa Rica flag white
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Design system typography
        'body': ['14px', { lineHeight: '1.5' }],
        'heading': ['24px', { lineHeight: '1.2' }],
      },
      spacing: {
        // Touch-friendly minimum sizes
        'touch': '44px', // Minimum touch target size
      },
      screens: {
        // Mobile-first breakpoints
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}

export default config