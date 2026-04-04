/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                clash: ['"Clash Display"', '"Outfit"', 'sans-serif'],
                epilogue: ['"Epilogue"', 'sans-serif'],
                sans: ['Inter', 'sans-serif'],
                syne: ['Syne', 'sans-serif'],
            },
            colors: {
                i1: '#3730a3',
                i2: '#4f46e5',
                i3: '#6366f1',
                i4: '#818cf8',
                i5: '#a5b4fc',
                text: '#1e1b4b',
                muted: '#6b7280',
                indigo: {
                    btn: '#7C3AED',
                    mid: '#6D28D9',
                    dark: '#5B21B6',
                    light: '#8B5CF6'
                },
                surface: '#F9FAFB',
            },
            animation: {
                'blob-drift': 'blob-drift 13s ease-in-out infinite',
                'blob-drift-rev': 'blob-drift 10s ease-in-out infinite reverse',
                'blob-drift-fast': 'blob-drift 8s ease-in-out infinite 2s',
                'pulse-fast': 'pulse-fast 2s infinite',
                'node-float': 'node-float 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
                badgePop: 'badgePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                badgeRing: 'badgeRing 1.8s ease-out infinite',
                slideInL: 'slideInL 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
                fadeUp: 'fadeUp 0.35s ease both',
            },
            keyframes: {
                'blob-drift': {
                    '0%, 100%': { transform: 'translate(0, 0)' },
                    '33%': { transform: 'translate(28px, -22px)' },
                    '66%': { transform: 'translate(-18px, 18px)' },
                },
                'pulse-fast': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.4' },
                },
                'node-float': {
                    'from': { opacity: '0', transform: 'translateY(16px) scale(0.94)' },
                    'to': { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                badgePop: {
                    '0%': { transform: 'scale(0)' },
                    '100%': { transform: 'scale(1)' },
                },
                badgeRing: {
                    '0%': { transform: 'scale(1)', opacity: '0.5' },
                    '100%': { transform: 'scale(1.6)', opacity: '0' },
                },
                slideInL: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
