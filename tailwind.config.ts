import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1f3864",
        gold: "#b8860b",
      },
    },
  },
  plugins: [],
};
export default config;
