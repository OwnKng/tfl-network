/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.svelte"],
  theme: {
    extend: {
      colors: { lightBlack: "var(--colors-light-black)" },
      primary: "var(--colors-primary)",
    },
  },
  plugins: [],
}
