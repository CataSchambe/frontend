/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-surface': 'var(--bg-surface)',
        'bg-card': 'var(--bg-card)',
        'text-main': 'var(--text-main)',
        'text-muted': 'var(--text-muted)',
        'accent-cyan': 'var(--accent-cyan)',
        'accent-purple': 'var(--accent-purple)',
        'border-subtle': 'var(--border-subtle)',
        'surface-hover': 'var(--surface-hover)',
        // Status colors
        'status-success': 'var(--status-success)',
        'status-warning': 'var(--status-warning)',
        'status-danger': 'var(--status-danger)',
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: 'var(--shadow-card)',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      }
    },
  },
  plugins: [],
}
