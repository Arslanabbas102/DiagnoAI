/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', '"Inter"', "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#EEF3FF",
          100: "#DCE6FF",
          200: "#BFD0FF",
          300: "#93B0FF",
          400: "#6488FB",
          500: "#3D63F2",
          600: "#2A4BDB",
          700: "#223CB2",
          800: "#1F358C",
          900: "#1C2F6E",
        },
        accent: {
          50: "#ECFDF8",
          100: "#D1FAEE",
          400: "#2DD4B0",
          500: "#14B89A",
          600: "#0B967E",
        },
        ink: {
          DEFAULT: "#0B1220",
          800: "#172033",
          700: "#2A3447",
        },
        muted: "#5B6475",
        line: "#E6E9F0",
        surface: "#F6F8FC",
        // Legacy tokens, remapped to the new palette
        primaryColor: "#2A4BDB",
        yellowColor: "#F5A524",
        purpleColor: "#7C5CFF",
        irisBlueColor: "#14B89A",
        headingColor: "#0B1220",
        textColor: "#5B6475",
      },
      boxShadow: {
        panelShadow: "0 24px 60px -12px rgba(15, 23, 42, 0.18)",
        soft: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -8px rgba(15, 23, 42, 0.08)",
        lift: "0 2px 4px rgba(15, 23, 42, 0.04), 0 24px 48px -16px rgba(15, 23, 42, 0.18)",
        brand: "0 10px 30px -10px rgba(42, 75, 219, 0.55)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "page-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
        "page-in": "page-in 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};
