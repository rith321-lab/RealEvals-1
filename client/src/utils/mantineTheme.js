import { createTheme } from '@mantine/core';

// Define the Mantine theme based on our design system
export const mantineTheme = createTheme({
  colors: {
    primary: [
      '#EBF5FF', // 50
      '#D6EBFF', // 100
      '#A6D4FF', // 200
      '#75BCFF', // 300
      '#45A3FF', // 400
      '#1A8CFF', // 500
      '#0077FF', // 600
      '#0062D6', // 700
      '#004EAD', // 800
      '#003A85', // 900
    ],
    secondary: [
      '#F0F4F8', // 50
      '#D9E2EC', // 100
      '#BCCCDC', // 200
      '#9FB3C8', // 300
      '#829AB1', // 400
      '#627D98', // 500
      '#486581', // 600
      '#334E68', // 700
      '#243B53', // 800
      '#102A43', // 900
    ],
    success: [
      '#ECFDF5', // 50
      '#D1FAE5', // 100
      '#A7F3D0', // 200
      '#6EE7B7', // 300
      '#34D399', // 400
      '#10B981', // 500
      '#059669', // 600
      '#047857', // 700
      '#065F46', // 800
      '#064E3B', // 900
    ],
    warning: [
      '#FFFBEB', // 50
      '#FEF3C7', // 100
      '#FDE68A', // 200
      '#FCD34D', // 300
      '#FBBF24', // 400
      '#F59E0B', // 500
      '#D97706', // 600
      '#B45309', // 700
      '#92400E', // 800
      '#78350F', // 900
    ],
    error: [
      '#FEF2F2', // 50
      '#FEE2E2', // 100
      '#FECACA', // 200
      '#FCA5A5', // 300
      '#F87171', // 400
      '#EF4444', // 500
      '#DC2626', // 600
      '#B91C1C', // 700
      '#991B1B', // 800
      '#7F1D1D', // 900
    ],
  },
  
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  
  radius: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
  },
  
  // Component specific styles
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
        shadow: 'md',
        p: 'lg',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
    },
    Badge: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});
