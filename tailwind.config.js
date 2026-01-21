/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FACC15', // Energy Gold aka Yellow-400
                    foreground: '#000000',
                },
                secondary: {
                    DEFAULT: '#0F172A', // Deep Trust aka Slate-900
                    foreground: '#FFFFFF',
                },
                accent: {
                    DEFAULT: '#22C55E', // Clean Green aka Green-500
                    foreground: '#FFFFFF',
                },
                surface: 'rgba(255, 255, 255, 0.05)',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'glow': '0 0 20px rgba(250, 204, 21, 0.3)',
            },
        },
    },
    plugins: [],
}
