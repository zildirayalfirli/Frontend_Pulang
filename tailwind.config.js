// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto-slab': ['Roboto Slab', 'serif'],
      },
      fontSize: {
        'heading-1' : ['3.812rem'], // 61px
        'heading-2' : ['3.062rem'], // 49px
        'heading-3' : ['2.438rem'], // 39px
        'heading-4' : ['1.938rem'], // 31px
        'heading-5' : ['1.562rem'], // 25px
        'heading-6' : ['1.25rem'],  // 20px
        'body-xl'   : ['1rem'],     // 16px
        'body-l'    : ['0.812rem'], // 13px
        'body-s'    : ['0.625rem'], // 10px
      },
      colors: {
        primary: {
          100: '#FFFFFF',
          300: '#E0E0E0',
          500: '#A6A6A6',
        },
        secondary: {
          100: '#E8AD81',
          300: '#EE7F2B',
          500: '#B86323',
        },
        tertiary: {
          100: '#797979',
          300: '#444444',
          500: '#000000',
        },
      },
    },
  },
  plugins: [],
}
