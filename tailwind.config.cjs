module.exports = {
  content: ['./index.html', './src/**/*.html', './src/**/*.vue', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'theme-violet': '#5613BF',
        'theme-violet-highlight': '#AB1DC5',
        'theme-violet-2': '#6b3bc5',
        'theme-pink': '#EBDAFD',
        'theme-pink-2': '#EDE0F9',
        'theme-pink-3': '#F5EBFF',
        'theme-pink-4': '#F5ECFF',
        'theme-blue-light': '#EBF4FF',
        'theme-blue-accent': '#116ED2',
        'theme-lavender': '#FBF9FF',
        'theme-charcoal': '#444444',
        'theme-light': '#FFFFF8'
      },
      fontFamily: {
        'dm-sans': ['DM Sans', 'sans-serif'],
        'dm-mono': ['DM Mono', 'monospace'],
        'battambang': ['Battambang', 'sans-serif']
      },
      backgroundImage: {
        'custom-gradient1': 'linear-gradient(90deg, #C343FF 0%, #9225FF 52%, #6100FF 100%)'
      },
      animation: {
        'bounce-fade': 'bounce 5s 5s',
        'fade': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeInUp 0.5s ease-in-out',
        'fade-down': 'fadeInDown 0.5s ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'scale-in-center': 'scaleInCenter 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)',
        'slide-in-bottom': 'slideInBottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)',
        'slide-in-top': 'slideInTop 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        scaleInCenter: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        slideInBottom: {
          '0%': { transform: 'translateY(1000px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideInTop: {
          '0%': { transform: 'translateY(-1000px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
