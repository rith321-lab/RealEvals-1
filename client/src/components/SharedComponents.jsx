import React from 'react';
import { 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Box,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Following Stripe's approach of having reusable, consistent components

// Styled components for consistent UI elements
export const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '90vh',
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
}));

export const PageTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(3),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  color: theme.palette.secondary.main,
  marginBottom: theme.spacing(2),
}));

export const CardContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  background: 'linear-gradient(to bottom right, #ffffff, #f0fdf4)',
  border: '1px solid #dcfce7',
  boxShadow: theme.shadows[2],
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

export const FormField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export const PrimaryButton = styled(Button)(({ theme }) => ({
  padding: '10px 16px',
  fontWeight: 600,
  boxShadow: theme.shadows[1],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[3],
    transform: 'translateY(-1px)',
  },
}));

export const LoadingButton = ({ loading, children, ...props }) => (
  <PrimaryButton
    disabled={loading}
    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
    {...props}
  >
    {children}
  </PrimaryButton>
);

// Animation utilities - inspired by Stripe's attention to micro-interactions
export const fadeInAnimation = {
  opacity: 0,
  animation: 'fadeIn 0.5s ease-in-out forwards',
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
};

export const slideInAnimation = {
  transform: 'translateY(20px)',
  opacity: 0,
  animation: 'slideIn 0.5s ease-out forwards',
  '@keyframes slideIn': {
    '0%': { transform: 'translateY(20px)', opacity: 0 },
    '100%': { transform: 'translateY(0)', opacity: 1 },
  },
};
