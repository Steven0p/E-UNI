/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#17223D',
          muted: '#5B6478',
          soft: '#8A93A6',
        },
        paper: '#E8E7E0',
        surface: '#FFFFFF',
        line: '#D6D4C8',
        accent: {
          DEFAULT: '#1D5C6B',
          hover: '#163F4A',
          soft: '#E3EDEE',
        },
        success: { DEFAULT: '#2E6B49', soft: '#E4EEE7' },
        warning: { DEFAULT: '#B4791F', soft: '#F5EADA' },
        danger: { DEFAULT: '#9C3B34', soft: '#F3E1DE' },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
