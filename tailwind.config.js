/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#161622",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#FF8E01",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
      },
      fontFamily: {
        pthin: ["Inter-Thin", "sans-serif"],
        pextralight: ["Inter-ExtraLight", "sans-serif"],
        plight: ["Inter-Light", "sans-serif"],
        pregular: ["Inter-Regular", "sans-serif"],
        pmedium: ["Inter-Medium", "sans-serif"],
        psemibold: ["Inter-SemiBold", "sans-serif"],
        pbold: ["Inter-Bold", "sans-serif"],
        pextrabold: ["Inter-ExtraBold", "sans-serif"],
        pblack: ["Inter-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};