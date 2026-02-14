import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#A78BFA', // Bright purple
        'primary-dark': '#8B5CF6', // Medium purple
        secondary: '#DDD6FE', // Very light purple/lavender
      },
      fontFamily: {
        sans: [
          '"Segoe UI"',
          '"Roboto"',
          '"Oxygen"',
          '"Ubuntu"',
          '"Cantarell"',
          '"Noto Sans"',
          '"Noto Sans JP"',
          '"Noto Sans KR"',
          '"Noto Sans Thai"',
          '"Noto Sans Vietnamese"',
          'sans-serif',
        ],
      },
      fontSize: {
        'responsive-sm': 'clamp(0.875rem, 2.5vw, 1rem)',
        'responsive-base': 'clamp(1rem, 3vw, 1.125rem)',
        'responsive-lg': 'clamp(1.125rem, 4vw, 1.5rem)',
        'responsive-xl': 'clamp(1.5rem, 5vw, 2rem)',
        'responsive-2xl': 'clamp(2rem, 6vw, 2.5rem)',
        'responsive-3xl': 'clamp(2.5rem, 8vw, 3rem)',
      },
      borderRadius: {
        lg: '1rem',
        xl: '1.5rem',
      },
      borderWidth: {
        3: '3px',
        4: '4px',
      },
    },
  },
  plugins: [],
} satisfies Config;
