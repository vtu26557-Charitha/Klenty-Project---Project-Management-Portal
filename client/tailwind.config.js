export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 8px 40px rgba(15, 23, 42, 0.12)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        surface: '#0b1220',
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
