/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        success: 'hsl(var(--success) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'Manrope', 'ui-sans-serif', 'sans-serif'],
      },
      fontSize: {
        'display-xl': [
          'clamp(3.5rem, 8vw, 7.5rem)',
          { lineHeight: '0.92', letterSpacing: '-0.075em' },
        ],
        'display-lg': ['clamp(3rem, 6vw, 6rem)', { lineHeight: '0.94', letterSpacing: '-0.065em' }],
        h1: ['clamp(2.75rem, 5vw, 5rem)', { lineHeight: '0.98', letterSpacing: '-0.06em' }],
        h2: ['clamp(2.25rem, 4vw, 3.75rem)', { lineHeight: '1.03', letterSpacing: '-0.05em' }],
        h3: ['clamp(1.5rem, 2.5vw, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.035em' }],
        h4: ['1.25rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.65' }],
        'body-md': ['0.9375rem', { lineHeight: '1.6' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.5' }],
        caption: ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.08em' }],
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 0.25rem)',
        '2xl': 'calc(var(--radius) + 0.5rem)',
        '3xl': 'calc(var(--radius) + 1rem)',
      },
      boxShadow: {
        card: '0 18px 50px -28px hsl(166 32% 14% / 0.24)',
        'card-hover': '0 28px 70px -30px hsl(166 32% 14% / 0.34)',
        float: '0 12px 28px -16px hsl(166 32% 14% / 0.32)',
      },
      transitionDuration: {
        quick: '150ms',
        standard: '250ms',
        gentle: '400ms',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
