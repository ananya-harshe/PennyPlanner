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
          500: '#58CC02',
          600: '#4CAA00',
          700: '#3D8A00',
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
