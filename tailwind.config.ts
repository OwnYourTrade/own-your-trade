import type { Config } from "tailwindcss";

// ===========================================================================
//  Own Your Trade — one design system across the hub and every demo.
//  Colour tokens resolve from CSS variables set once in globals.css (:root).
//  Receipt / ledger palette: ink, paper, stamp (red), ledger (green).
//  Legacy token names (lacquer/gold/cream/jade/primary/accent/support) are kept
//  as aliases so existing demo components keep working during the rebrand.
// ===========================================================================

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Semantic OYT tokens ------------------------------------------
        ink: {
          DEFAULT: "rgb(var(--c-ink) / <alpha-value>)",
          soft: "rgb(var(--c-ink-soft) / <alpha-value>)",
        },
        paper: {
          DEFAULT: "rgb(var(--c-paper) / <alpha-value>)",
          dark: "rgb(var(--c-paper-dark) / <alpha-value>)",
        },
        stamp: {
          DEFAULT: "rgb(var(--c-stamp) / <alpha-value>)",
          dark: "rgb(var(--c-stamp-dark) / <alpha-value>)",
          light: "rgb(var(--c-stamp-light) / <alpha-value>)",
        },
        ledger: {
          DEFAULT: "rgb(var(--c-ledger) / <alpha-value>)",
          dark: "rgb(var(--c-ledger-dark) / <alpha-value>)",
          light: "rgb(var(--c-ledger-light) / <alpha-value>)",
        },

        // --- Legacy aliases (map onto the new palette) --------------------
        primary: {
          DEFAULT: "rgb(var(--c-stamp) / <alpha-value>)",
          dark: "rgb(var(--c-stamp-dark) / <alpha-value>)",
          light: "rgb(var(--c-stamp-light) / <alpha-value>)",
        },
        lacquer: {
          DEFAULT: "rgb(var(--c-stamp) / <alpha-value>)",
          dark: "rgb(var(--c-stamp-dark) / <alpha-value>)",
          light: "rgb(var(--c-stamp-light) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--c-ledger) / <alpha-value>)",
          light: "rgb(var(--c-ledger-light) / <alpha-value>)",
          dark: "rgb(var(--c-ledger-dark) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "rgb(var(--c-ledger) / <alpha-value>)",
          light: "rgb(var(--c-ledger-light) / <alpha-value>)",
          dark: "rgb(var(--c-ledger-dark) / <alpha-value>)",
        },
        cream: {
          DEFAULT: "rgb(var(--c-paper) / <alpha-value>)",
          dark: "rgb(var(--c-paper-dark) / <alpha-value>)",
        },
        jade: "rgb(var(--c-ledger) / <alpha-value>)",
        support: "rgb(var(--c-ledger) / <alpha-value>)",

        // --- Crafted-warmth additions (redesign experiment) ---------------
        sand: {
          DEFAULT: "rgb(var(--c-sand) / <alpha-value>)",
          dark: "rgb(var(--c-sand-dark) / <alpha-value>)",
        },
        clay: "rgb(var(--c-clay) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        craft: ["var(--font-craft)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 2px 10px -4px rgba(30, 42, 48, 0.10)",
        card: "0 14px 44px -20px rgba(30, 42, 48, 0.20)",
        ticket: "0 1px 2px rgba(30,42,48,0.04), 0 16px 40px -24px rgba(30,42,48,0.20)",
        lift: "0 24px 52px -24px rgba(30,42,48,0.28)",
        // Warm brown-tinted shadows for the crafted-warmth surfaces.
        warm: "0 2px 8px -3px rgba(97,63,24,0.10), 0 18px 40px -22px rgba(97,63,24,0.24)",
        "warm-lg": "0 4px 14px -4px rgba(97,63,24,0.12), 0 30px 60px -26px rgba(97,63,24,0.32)",
      },
      backgroundImage: {
        "hero-fade":
          "linear-gradient(to top, rgba(30,42,48,0.92) 0%, rgba(30,42,48,0.55) 45%, rgba(30,42,48,0.20) 100%)",
      },
      letterSpacing: {
        wordmark: "0.02em",
      },
    },
  },
  plugins: [],
};

export default config;
