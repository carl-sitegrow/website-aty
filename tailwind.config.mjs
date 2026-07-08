/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Archivo Variable', 'Archivo', 'system-ui', 'sans-serif'],
      },
      colors: {
        forest: {
          DEFAULT: '#1b4332',
          soft: '#2d5a45',
          deep: '#0e1f1a',
        },
        amber: {
          DEFAULT: '#d97706',
          hover: '#b45309',
        },
        cream: {
          DEFAULT: '#faf9f6',
          soft: '#f3f1ed',
          warm: '#fdfcf7',
        },
        ink: {
          DEFAULT: '#1f2937',
          muted: '#3d4f4a',
        },
        line: '#e5e7eb',
      },
      boxShadow: {
        card: '0 4px 6px rgba(0,0,0,0.03)',
      },
      maxWidth: {
        content: '80rem',
      },
    },
  },
  plugins: [],
};
