import { createTheme } from '@mui/material/styles';

// Define the MUI theme based on our design system
export const muiTheme = createTheme({
  palette: {
    primary: {
      light: '#45A3FF', // 400
      main: '#0077FF', // 600
      dark: '#004EAD', // 800
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: '#829AB1', // 400
      main: '#486581', // 600
      dark: '#243B53', // 800
      contrastText: '#FFFFFF',
    },
    success: {
      light: '#6EE7B7', // 300
      main: '#10B981', // 500
      dark: '#047857', // 700
      contrastText: '#FFFFFF',
    },
    warning: {
      light: '#FCD34D', // 300
      main: '#F59E0B', // 500
      dark: '#B45309', // 700
      contrastText: '#FFFFFF',
    },
    error: {
      light: '#FCA5A5', // 300
      main: '#EF4444', // 500
      dark: '#B91C1C', // 700
      contrastText: '#FFFFFF',
    },
    info: {
      light: '#93C5FD', // 300
      main: '#3B82F6', // 500
      dark: '#1D4ED8', // 700
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      disabled: '#9CA3AF',
    },
  },
  
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontSize: 16,
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  
  shape: {
    borderRadius: 8,
  },
  
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    ...Array(19).fill('none'), // MUI expects 25 shadow values
  ],
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '0.625rem 1.25rem',
          fontWeight: 600,
          boxShadow: 'none',
          textTransform: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(to right, #0077FF, #0062D6)',
        },
        containedSecondary: {
          background: 'linear-gradient(to right, #486581, #334E68)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '0.75rem 1rem',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#F9FAFB',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F3F4F6',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});
