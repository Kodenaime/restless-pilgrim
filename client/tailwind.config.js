/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",            // for Vite
    "./src/**/*.{js,jsx,ts,tsx}" // scans all React component files
  ],
 theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
