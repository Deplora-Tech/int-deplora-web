import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        scrollbarTrack: "#1A202C",
        scrollbarThumb: "#4A5568",
      },
      borderRadius: {
        "scrollbar-rounded": "8px",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    require("tailwindcss/plugin")(function ({
      addUtilities,
      theme,
    }: {
      addUtilities: (utilities: Record<string, any>) => void;
      theme: (path: string) => any;
    }) {
      addUtilities({
        ".scrollbar-thumb-rounded": {
          "border-radius": theme("borderRadius.scrollbar-rounded"),
        },
        ".scrollbar-thumb-darker": {
          background: theme("colors.scrollbarThumb"),
        },
        ".scrollbar-track-darker": {
          background: theme("colors.scrollbarTrack"),
        },
      });
    }),
  ],
  variants: {
    scrollbar: ["rounded"],
  },
} satisfies Config;
