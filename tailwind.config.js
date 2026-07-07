/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        farsi: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      direction: ['rtl'],
    },
  },
  plugins: [],
}
