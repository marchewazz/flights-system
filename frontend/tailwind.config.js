module.exports = {
  mode: 'jit',
  purge: [
    './src/index.html',
    './src/app/components/**/*.html',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/custom-forms'),
    require('tailwind-scrollbar'),
  ]
}
