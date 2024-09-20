module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'tech-green': {
          100: '#e6f0e8',
          200: '#cce1d1',
          300: '#b3d2ba',
          400: '#99c3a3',
          500: '#80b48c',
          600: '#66a575',
          700: '#4d965e',
          800: '#338747',
          900: '#1a7830',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}