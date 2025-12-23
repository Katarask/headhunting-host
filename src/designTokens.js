// Design Tokens - Unified across all pages
// This file contains all design tokens for consistent styling

const T = {
  colors: {
    // Base colors
    sand: '#DBD6CC',
    cream: '#EFEDE5',
    burgundy: '#652126',
    black: '#0a0a0a',
    darkAlt: '#151413',
    // Aliases (for compatibility)
    white: '#EFEDE5',
    dark: '#0a0a0a',
    accent: '#652126',
    // Für dunkle Hintergründe
    muted: 'rgba(207, 187, 163, 0.5)',
    mutedLight: '#DBD6CC',  // Solid version for text on dark bg
    mutedLightAlpha: 'rgba(239, 237, 229, 0.55)',  // Transparent version
    border: 'rgba(207, 187, 163, 0.15)',
    borderLight: 'rgba(239, 237, 229, 0.15)',
    navActive: 'rgba(207, 187, 163, 0.2)',
    // Für helle Hintergründe (Sand)
    mutedDark: 'rgba(10, 10, 10, 0.5)',
    borderDark: 'rgba(10, 10, 10, 0.12)',
    // Status colors
    success: '#2D5A3D',
    warning: '#8B6914',
    danger: '#652126',
  },
  font: '"JetBrains Mono", "SF Mono", monospace',
  space: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    xxl: '64px',
    section: 'clamp(80px, 12vw, 140px)',
  },
  // Einheitliches Type-System mit klarer Hierarchie
  type: {
    // Display - Große Hero Headlines
    displayXL: { size: 'clamp(64px, 12vw, 180px)', weight: 400 },  // CTA "Sprechen?"
    displayL: { size: 'clamp(48px, 8vw, 96px)', weight: 200 },     // Hauptzahlen (Calculator, Stats)
    displayM: { size: 'clamp(40px, 7vw, 72px)', weight: 300 },     // Hero H1

    // Headlines - Section Headlines
    h2: { size: 'clamp(28px, 4vw, 48px)', weight: 300 },           // Section Headlines
    h3: { size: 'clamp(20px, 3vw, 28px)', weight: 300 },           // Sub-Headlines

    // Body - Lesbare Texte
    bodyL: { size: '16px', weight: 300 },                          // Quotes, wichtiger Text
    bodyM: { size: '14px', weight: 400 },                          // Standard Body
    bodyS: { size: '13px', weight: 400 },                          // Helper Text, FAQ Content

    // UI - Interface Elemente
    label: { size: '11px', spacing: '0.15em', weight: 400 },       // Labels, Section Numbers
    button: { size: '11px', spacing: '0.1em', weight: 500 },       // Buttons, CTAs
    micro: { size: '10px', spacing: '0.12em', weight: 400 },       // Footer, Navigation

    // Special
    input: { size: '24px', weight: 300 },                          // Form Inputs
  },
  easing: {
    smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
    snappy: 'cubic-bezier(0.19, 1, 0.22, 1)',
  },
};

export default T;
