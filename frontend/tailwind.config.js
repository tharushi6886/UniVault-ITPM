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
            },
            colors: {
                i1: '#3730a3',
                i2: '#4f46e5',
                i3: '#6366f1',
                i4: '#818cf8',
                i5: '#a5b4fc',
                text: '#1e1b4b',
                muted: '#6b7280',
            },
            animation: {
                'blob-drift': 'blob-drift 13s ease-in-out infinite',
                'blob-drift-rev': 'blob-drift 10s ease-in-out infinite reverse',
                'blob-drift-fast': 'blob-drift 8s ease-in-out infinite 2s',
                'pulse-fast': 'pulse-fast 2s infinite',
                'node-float': 'node-float 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
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
                }
            }
        },
    },
    plugins: [],
}
