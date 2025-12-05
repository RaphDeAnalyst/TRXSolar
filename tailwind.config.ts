import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
};

export default config;
