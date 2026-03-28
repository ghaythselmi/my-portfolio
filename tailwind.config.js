/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body:    ["'Plus Jakarta Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        void:    '#0d0b1e',
        depth:   '#110e26',
        surface: '#17152e',
        panel:   '#201d3a',
        edge:    '#2e2a4a',
        coral:   '#ff6035',
        gold:    '#f4c430',
        mint:    '#2de2a4',
        purple:  '#9b5de5',
        ink:     '#fff8f0',
      },
      animation: {
        'spin-slow':    'spin 8s linear infinite',
        'float':        'nebulaFloat 24s ease-in-out infinite alternate',
        'glow-pulse':   'glowBreath 7s ease-in-out infinite',
      },
      gridTemplateColumns: {
        'auto': 'repeat(auto-fit, minmax(200px, 1fr))',
      },
      boxShadow: {
        'coral':  '0 10px 36px rgba(255, 96, 53, 0.4)',
        'gold':   '0 10px 36px rgba(244, 196, 48, 0.3)',
        'mint':   '0 10px 36px rgba(45, 226, 164, 0.3)',
        'inset-glow': 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      borderRadius: {
        'pill': '100px',
      },
    },
  },
  plugins: [],
}
