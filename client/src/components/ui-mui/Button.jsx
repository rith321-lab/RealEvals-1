import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  isLoading = false,
  leftIcon = null,
  rightIcon = null,
  as: Component = "button",
  ...props
}) => {
  // Map custom variants to MUI variants
  const variantMap = {
    primary: "contained",
    secondary: "outlined",
    outline: "outlined",
    ghost: "text",
    link: "text",
    danger: "contained",
  };
  
  // Map custom sizes to MUI sizes
  const sizeMap = {
    xs: "small",
    sm: "small",
    md: "medium",
    lg: "large",
    xl: "large", // MUI doesn't have xl, so we use large
  };
  
  // Map custom colors
  const colorMap = {
    primary: "primary",
    secondary: "secondary",
    danger: "error",
  };
  
  // For link variant, we need to add underline style
  const linkStyle = variant === 'link' ? { textDecoration: 'underline' } : {};
  
  return (
    <MuiButton
      variant={variantMap[variant] || "contained"}
      size={sizeMap[size] || "medium"}
      color={variant === "danger" ? "error" : colorMap[variant] || "primary"}
      disabled={disabled || isLoading}
      startIcon={!isLoading && leftIcon ? leftIcon : null}
      endIcon={!isLoading && rightIcon ? rightIcon : null}
      className={className}
      component={Component !== "button" ? Component : undefined}
      style={linkStyle}
      {...props}
    >
      {isLoading && (
        <CircularProgress
          size={20}
          color="inherit"
          sx={{ mr: 1 }}
        />
      )}
      {children}
    </MuiButton>
  );
};

export default Button;
