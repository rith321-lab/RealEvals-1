import { createTheme } from '@mui/material/styles';

// Create a theme instance based on the existing Tailwind color scheme
// This follows Stripe's principle of maintaining a consistent design system
const theme = createTheme({
  palette: {
    primary: {
      main: '#16a34a', // primary-600 from tailwind config
      light: '#4ade80', // primary-400 from tailwind config
      dark: '#15803d', // primary-700 from tailwind config
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#374151', // secondary-700 from tailwind config
      light: '#6b7280', // secondary-500 from tailwind config
      dark: '#1f2937', // secondary-800 from tailwind config
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f9fafb', // secondary-50 from tailwind config
    },
    text: {
      primary: '#1f2937', // secondary-800 from tailwind config
      secondary: '#4b5563', // secondary-600 from tailwind config
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#3b82f6',
    },
    success: {
      main: '#10b981',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none', // Following Stripe's clean design principle
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Clean design without unnecessary patterns
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#4ade80',
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#4ade80',
          '& .MuiTableCell-head': {
            color: '#ffffff',
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: '#f9fafb',
          },
          '&:hover': {
            backgroundColor: '#f0fdf4',
            transition: 'background-color 0.2s',
          },
        },
      },
    },
  },
});

export default theme;
