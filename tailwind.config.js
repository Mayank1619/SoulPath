/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                bone: "rgb(var(--color-bone) / <alpha-value>)",
                sand: "rgb(var(--color-sand) / <alpha-value>)",
                dune: "rgb(var(--color-dune) / <alpha-value>)",
                ink: "rgb(var(--color-ink) / <alpha-value>)",
                moss: "rgb(var(--color-moss) / <alpha-value>)",
                ember: "rgb(var(--color-ember) / <alpha-value>)",
                rosewood: "rgb(var(--color-rosewood) / <alpha-value>)",
            },
            boxShadow: {
                soft: "0 12px 40px -20px rgba(47, 42, 36, 0.35)",
                lift: "0 18px 50px -26px rgba(47, 42, 36, 0.45)",
            },
            borderRadius: {
                xl: "1.25rem",
            },
            fontFamily: {
                serif: ["Garamond", "Palatino Linotype", "Book Antiqua", "serif"],
                sans: ["Trebuchet MS", "Gill Sans", "Calibri", "sans-serif"],
            },
            backgroundImage: {
                aura: "radial-gradient(circle at top, rgba(176, 141, 87, 0.22), transparent 55%)",
                haze: "radial-gradient(circle at 20% 10%, rgba(111, 122, 106, 0.18), transparent 40%)",
            },
            keyframes: {
                fadeUp: {
                    "0%": { opacity: "0", transform: "translateY(14px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                floatSlow: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-6px)" },
                },
            },
            animation: {
                fadeUp: "fadeUp 0.7s ease-out both",
                floatSlow: "floatSlow 6s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
