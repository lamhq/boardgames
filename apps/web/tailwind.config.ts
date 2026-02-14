import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
        'responsive-sm': 'clamp(1rem, 2.5vw, 1.25rem)',
        'responsive-base': 'clamp(1.25rem, 3vw, 1.375rem)',
        'responsive-lg': 'clamp(1.375rem, 4vw, 1.75rem)',
        'responsive-xl': 'clamp(1.875rem, 5vw, 2.375rem)',
        'responsive-2xl': 'clamp(2.375rem, 6vw, 2.875rem)',
        'responsive-3xl': 'clamp(2.875rem, 8vw, 3.5rem)',
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
