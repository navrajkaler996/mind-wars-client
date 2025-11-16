// ============================================
// QUIZCLASH DESIGN SYSTEM
// ============================================

// ============================================
// 1. COLOR PALETTE
// ============================================
export const colors = {
  // Primary Colors
  purple: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',  // Main purple
    600: '#9333EA',
    700: '#7E22CE',
    800: '#6B21A8',
    900: '#581C87',
  },
  
  cyan: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',  // Main cyan
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },
  
  pink: {
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899',  // Main pink
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843',
  },
  
  // Background Colors
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',  // Main dark background
    950: '#020617',
  },
  
  // Semantic Colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

// ============================================
// 2. GRADIENTS
// ============================================
export const gradients = {
  primary: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
  secondary: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
  background: 'linear-gradient(135deg, #0F172A 0%, #581C87 50%, #0F172A 100%)',
  card: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
  
  // CSS-ready versions
  css: {
    primary: 'from-purple-500 to-pink-500',
    secondary: 'from-cyan-500 to-blue-500',
    background: 'from-slate-900 via-purple-900 to-slate-900',
    text: 'from-purple-400 via-pink-400 to-cyan-400',
  }
};

// ============================================
// 3. TYPOGRAPHY
// ============================================
export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  }
};

// ============================================
// 4. SPACING
// ============================================
export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
};

// ============================================
// 5. BORDER RADIUS
// ============================================
export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

// ============================================
// 6. SHADOWS
// ============================================
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  glow: {
    purple: '0 0 40px rgba(168, 85, 247, 0.5)',
    cyan: '0 0 40px rgba(6, 182, 212, 0.5)',
    pink: '0 0 40px rgba(236, 72, 153, 0.5)',
  }
};

// ============================================
// 7. REUSABLE TAILWIND CLASSES
// ============================================
export const styles = {
  // Backgrounds
  bg: {
    primary: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    card: 'bg-white/5 backdrop-blur-sm',
    cardHover: 'hover:bg-white/10',
    glass: 'bg-white/10 backdrop-blur-sm border border-white/20',
  },
  
  // Buttons
  button: {
    primary: 'px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105',
    secondary: 'px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20',
    icon: 'p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20',
  },
  
  // Cards
  card: {
    base: 'bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10',
    hover: 'hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2',
    interactive: 'bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer',
  },
  
  // Text
  text: {
    gradient: 'bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent',
    muted: 'text-slate-400',
    title: 'text-4xl md:text-5xl font-bold',
  },
  
  // Icons
  icon: {
    wrapper: 'w-14 h-14 bg-gradient-to-br rounded-xl flex items-center justify-center',
    purple: 'from-purple-500 to-purple-600',
    cyan: 'from-cyan-500 to-cyan-600',
    pink: 'from-pink-500 to-pink-600',
  },
  
  // Input
  input: {
    base: 'w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors',
  },
  
  // Badges
  badge: {
    base: 'inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-full border',
    purple: 'bg-purple-500/20 border-purple-500/30 text-purple-200',
    cyan: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-200',
    pink: 'bg-pink-500/20 border-pink-500/30 text-pink-200',
  },
};

// ============================================
// 8. ANIMATIONS
// ============================================
export const animations = {
  // CSS animation classes
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  
  // Custom timing
  transition: {
    fast: 'transition-all duration-150',
    normal: 'transition-all duration-300',
    slow: 'transition-all duration-500',
  },
  
  // Hover effects
  hover: {
    scale: 'transform hover:scale-105 transition-transform duration-300',
    lift: 'transform hover:-translate-y-2 transition-transform duration-300',
    glow: 'hover:shadow-2xl transition-shadow duration-300',
  }
};

// ============================================
// 9. USAGE EXAMPLES IN REACT
// ============================================
/*
// Example 1: Using color values directly
import { colors } from './design-system';

const MyComponent = () => (
  <div style={{ backgroundColor: colors.purple[500] }}>
    Content
  </div>
);

// Example 2: Using Tailwind classes from styles
import { styles } from './design-system';

const MyButton = () => (
  <button className={styles.button.primary}>
    Click Me
  </button>
);

// Example 3: Creating a custom card
import { styles } from './design-system';

const MyCard = () => (
  <div className={`${styles.card.base} ${styles.card.hover}`}>
    <h3 className={styles.text.gradient}>Title</h3>
    <p className={styles.text.muted}>Description</p>
  </div>
);

// Example 4: Using gradients
import { gradients } from './design-system';

const GradientBackground = () => (
  <div className={`bg-gradient-to-r ${gradients.css.primary}`}>
    Content
  </div>
);

// Example 5: Icon with background
import { styles } from './design-system';
import { Zap } from 'lucide-react';

const IconBox = () => (
  <div className={`${styles.icon.wrapper} ${styles.icon.purple}`}>
    <Zap className="w-7 h-7" />
  </div>
);
*/

// ============================================
// 10. COMPONENT TEMPLATES
// ============================================
export const componentTemplates = {
  // Animated background blobs
  backgroundBlobs: `
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '700ms'}}></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1000ms'}}></div>
    </div>
  `,
  
  // Glass card
  glassCard: `
    <div className="${styles.card.interactive}">
      <div className="${styles.icon.wrapper} ${styles.icon.purple} mb-4">
        {/* Icon here */}
      </div>
      <h3 className="text-xl font-bold mb-3">Title</h3>
      <p className="${styles.text.muted}">Description</p>
    </div>
  `,
  
  // Badge
  badge: `
    <div className="${styles.badge.base} ${styles.badge.purple}">
      {/* Icon */}
      <span className="text-sm">Badge Text</span>
    </div>
  `,
};

export default {
  colors,
  gradients,
  typography,
  spacing,
  borderRadius,
  shadows,
  styles,
  animations,
  componentTemplates,
};

