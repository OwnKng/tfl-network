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
        dashboard: "1230px",
        page: "1230px",
        content: "720px",
      },
      height: {
        graph: "500px",
        map: "720px",
        facet: "220px",
        "graph-sm": "380px",
      },
    },
  },
  plugins: [],
}
