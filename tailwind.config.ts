import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#1e3b8a",
                background: "#f6f6f8",
            },
        },
    },
    plugins: [],
};

export default config;
