module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#80A1BA',    // Main blue
        secondary: '#91C4C3',  // Teal
        accent: '#B4DEBD',     // Mint green
        background: '#FFF7DD', // Cream background
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}