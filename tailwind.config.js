/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        //   'hand': ['Fuggles'],
        hand: ['"Comforter"'],
        //   'hand': ['Charmonman'],
      },
      colors: {
        primary: {
          DEFAULT: "#F45D22",
          50: "#FDDDD1",
          100: "#FCCFBD",
          200: "#FAB297",
          300: "#F89670",
          400: "#F67949",
          500: "#F45D22",
          600: "#D3430B",
          700: "#9E3208",
          800: "#682105",
          900: "#331003",
          950: "#180801",
        },

        secondary: {
          DEFAULT: "#0A9EF5",
          50: "#BAE4FC",
          100: "#A7DCFB",
          200: "#80CDFA",
          300: "#58BDF8",
          400: "#31AEF7",
          500: "#0A9EF5",
          600: "#087BBF",
          700: "#065889",
          800: "#033653",
          900: "#01131D",
          950: "#000202",
        },
      },

      keyframes: {
        pulse: {
          "0%, 100%": { opacity: "1" },
          "40%": { opacity: "0.3" },
        },
      },
      animation: {
        pulse: "pulse 1.3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
