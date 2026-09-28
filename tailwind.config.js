/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#22c55e',
        secondary: '#16a34a',
        accent: '#86efac',
        dark: '#1a1a2e',
        card: '#16213e',
      },
    },
  },
  plugins: [],
};
