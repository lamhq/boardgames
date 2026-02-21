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
