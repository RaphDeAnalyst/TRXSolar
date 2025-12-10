import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'sm': '400px',   // Large Mobile/Small Tablet
      'md': '768px',   // Tablet/Desktop
      'lg': '1024px',  // Standard Desktop
      'xl': '1280px',  // Large Monitors
      '2xl': '1536px', // Extra Large
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#007A87',
          light: '#00A3B5',
          dark: '#004D57',
        },
        surface: '#FFFFFF',
        background: '#FAFAFA',
        text: {
          primary: '#212121',
          secondary: '#666666',
        },
        border: '#E0E0E0',
        success: '#34A853',
        error: '#EA4335',
        warning: '#FBBC04',
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '1rem',
        'md': '1.5rem',
        'lg': '2rem',
        'xl': '3rem',
        '2xl': '4rem',
      },
      fontSize: {
        'h1': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h1-mobile': ['1.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['1.75rem', { lineHeight: '1.3', fontWeight: '500' }],
        'h2-mobile': ['1.25rem', { lineHeight: '1.3', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'button': ['0.875rem', { lineHeight: '1.2', fontWeight: '500' }],
        'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      minHeight: {
        'touch': '3rem',
      },
      minWidth: {
        'touch': '3rem',
      },
      width: {
        'touch': '3rem',
      },
      height: {
        'touch': '3rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(1rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        modalEnter: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        backdropFade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-out-right': 'slideOutRight 0.2s ease-in',
        'modal-enter': 'modalEnter 0.3s ease-out',
        'backdrop-fade': 'backdropFade 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
