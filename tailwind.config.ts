import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // NOTE: these map to hex-valued CSS variables so canvas code can read them
      // with getPropertyValue(). The trade-off is that Tailwind's opacity
      // modifier does NOT work on them — `bg-ink/85` compiles to
      // `rgb(var(--ink) / .85)`, which is invalid CSS and is silently dropped,
      // leaving the element with no background at all. For a translucent
      // surface, add a token in globals.css and use `bg-[var(--surface-x)]`.
      colors: {
        ink: "var(--ink)",
        panel: "var(--panel)",
        panel2: "var(--panel-2)",
        rule: "var(--rule)",
        text: "var(--text)",
        dim: "var(--dim)",
        dim2: "var(--dim-2)",
        signal: "var(--signal)",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      maxWidth: {
        measure: "var(--measure)",
      },
    },
  },
  plugins: [],
} satisfies Config;
