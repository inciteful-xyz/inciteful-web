module.exports = {
  purge: ['./src/**/*.html', './src/**/*.vue'],
  theme: {
    extend: {
      animation: {
        'bounce-fade': 'bounce 5s 5s'
      }
    }
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')]
}
