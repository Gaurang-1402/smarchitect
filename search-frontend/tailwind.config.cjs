const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'body': "url('./assets/g_bg.jpg')",
      },
    },
  },
  plugins: [],
}