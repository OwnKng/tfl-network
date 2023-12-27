/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.svelte"],
  theme: {
    extend: {
      colors: {
        lightBlack: "var(--colors-light-black)",
        primary: "var(--colors-primary)",
        midnight: "var(--colors-midnight)",
        "midnight-75": "var(--colors-midnight-75)",
        "midnight-50": "var(--colors-midnight-50)",
        "midnight-25": "var(--colors-midnight-25)",
      },
      maxWidth: {
        dashboard: "1380px",
      },
      height: {
        graph: "500px",
        map: "600px",
      },
    },
  },
  plugins: [],
}
