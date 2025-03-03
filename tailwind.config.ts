import type { Config } from "tailwindcss";
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
        animation: {
          "spin-slow": "spin 45s linear infinite",
        },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'scrollbar-bg': '#f0f0f0',
        'scrollbar-thumb': '#888',
        'scrollbar-thumb-hover': '#555',
      },
      
    },
  },
  plugins: [
    tailwindScrollbar,
  ],
} satisfies Config;
