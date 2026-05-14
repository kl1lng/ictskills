/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5', // Indigo
          hover: '#4338ca',
        },
        surface: {
          DEFAULT: '#f8fafc', // Slate
        }
      },
    },
  },
  plugins: [],
}
