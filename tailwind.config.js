module.exports = {
  content: ['./src/**/*.html', './src/**/*.vue'],
  theme: {
    extend: {
      animation: {
        'bounce-fade': 'bounce 5s 5s'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
