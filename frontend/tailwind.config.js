/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        avenir: ["Avenir", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        "custom-blue": "#0071E3",
        "custom-gray": "#F5F5F7",
        "custom-dark-gray": "#1D1D1F",
        "custom-light-gray": "#86868B",
        "yellow-gold": "#E6CA97",
        "white-gold": "#D9D9D9",
        "rose-gold": "#E1A4A9",
      },
      fontSize: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
        "custom-12": "0.75rem", // Avenir - Book - 12
        "custom-14": "0.875rem", // Avenir - Book - 14
        "custom-15": "0.9375rem", // Montserrat - Regular/Medium - 15
        "custom-45": "2.8125rem", // Avenir - Book - 45
      },
      fontWeight: {
        light: "300",
        book: "400",
        roman: "500",
        medium: "600",
        heavy: "800",
        black: "900",
        // Montserrat weights
        normal: "400",
        "montserrat-medium": "500",
        bold: "700",
      },
    },
  },
  plugins: [],
};

export default config;
