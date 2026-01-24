export default {
  content: [
    "./index.html",
    "./src/**/*.{jsx,js,tsx,ts}",
    "./src/pages/**/*.{jsx,js}",
    "./src/components/**/*.{jsx,js}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          500: 'var(--emerald)', // Custom Emerald
          600: 'var(--tropical-teal)', // Darker
          700: 'var(--baltic-blue)', // Darkest
          100: 'var(--tea-green)', // Lightest
          200: 'var(--light-green)', // Light
          300: 'var(--light-green)',
          400: 'var(--emerald)',
        },
        sky: {
          500: '#1CB0F6',
          600: '#1699DD',
          700: '#0F7BC4',
        },
      },
    },
  },
  plugins: [],
}
