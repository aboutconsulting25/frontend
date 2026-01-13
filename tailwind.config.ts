import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Figma exact colors
        primary: {
          DEFAULT: '#1976D2',
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#1976D2',
          600: '#1565C0',
          700: '#0D47A1',
        },
        accent: {
          DEFAULT: '#F5A623',
          light: '#FFF8E1',
          dark: '#E09000',
        },
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        success: {
          DEFAULT: '#4CAF50',
          light: '#E8F5E9',
          dark: '#2E7D32',
        },
        error: {
          DEFAULT: '#F44336',
          light: '#FFEBEE',
          dark: '#C62828',
        },
        warning: {
          DEFAULT: '#FF9800',
          light: '#FFF3E0',
        },
        info: {
          DEFAULT: '#2196F3',
          light: '#E3F2FD',
        },
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '16px' }],
        'sm': ['12px', { lineHeight: '16px' }],
        'base': ['13px', { lineHeight: '20px' }],
        'lg': ['14px', { lineHeight: '20px' }],
        'xl': ['16px', { lineHeight: '24px' }],
        '2xl': ['18px', { lineHeight: '24px' }],
        '3xl': ['20px', { lineHeight: '28px' }],
        '4xl': ['24px', { lineHeight: '32px' }],
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'dropdown': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'modal': '0 10px 40px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
      },
    },
  },
  plugins: [],
};
export default config;
