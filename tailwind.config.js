module.exports = {
  purge: ['./app/**/*.html', './app/**/*.vue', './templates/*.html'],
  theme: {
    extend: {
      animation: {
        'bounce-fade': 'bounce 5s 5s'
      },
      backgroundImage: theme => ({
        twitter: "url('/assets/images/twitter.svg')",
        reddit: "url('/assets/images/reddit.svg')",
        email: "url('/assets/images/email.svg')",
        facebook: "url('/assets/images/facebook.svg')",
        linkedin: "url('/assets/images/linkedin.svg')"
      })
    }
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')]
}
