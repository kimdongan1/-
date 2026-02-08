/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00f0ff',
          pink: '#ff00ff',
          purple: '#9d00ff',
          green: '#00ff41',
        }
      },
      boxShadow: {
        'neon-blue': '0 0 5px #00f0ff, 0 0 20px #00f0ff, 0 0 40px #00f0ff',
        'neon-pink': '0 0 5px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff',
        'neon-purple': '0 0 5px #9d00ff, 0 0 20px #9d00ff, 0 0 40px #9d00ff',
        'neon-green': '0 0 5px #00ff41, 0 0 20px #00ff41, 0 0 40px #00ff41',
      }
    },
  },
  plugins: [],
}
