import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                slate: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',  // Border
                    300: '#CBD5E1',
                    400: '#94A3B8',  // Tertiary Text / Border Focus
                    500: '#64748B',  // Secondary Text
                    600: '#475569',
                    700: '#334155',  // Light Primary
                    800: '#1E293B',
                    900: '#0F172A',  // Primary Brand
                    950: '#020617',
                },
                primary: {
                    DEFAULT: '#0F172A',
                    foreground: '#FFFFFF',
                },
                secondary: {
                    DEFAULT: '#F1F5F9', // Slate 100
                    foreground: '#0F172A',
                },
                accent: {
                    DEFAULT: '#2563EB', // Blue 600
                    foreground: '#FFFFFF',
                },
                destructive: {
                    DEFAULT: '#EF4444', // Red 500
                    foreground: '#FFFFFF',
                },
                muted: {
                    DEFAULT: '#F1F5F9',
                    foreground: '#64748B',
                },
                card: {
                    DEFAULT: '#FFFFFF',
                    foreground: '#0F172A',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)'],
            }
        },
    },
    plugins: [],
};
export default config;
