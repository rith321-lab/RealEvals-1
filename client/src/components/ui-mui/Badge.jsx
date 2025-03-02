import React from 'react';
import { Chip } from '@mui/material';

const Badge = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  // Map custom variants to MUI colors
  const colorMap = {
    primary: "primary",
    secondary: "default",
    success: "success",
    warning: "warning",
    danger: "error",
    info: "info",
  };
  
  // Map custom sizes to MUI sizes
  const sizeMap = {
    sm: "small",
    md: "medium",
    lg: "medium", // MUI Chip only has small and medium
  };
  
  return (
    <Chip
      color={colorMap[variant] || "primary"}
      size={sizeMap[size] || "medium"}
      label={children}
      className={className}
      {...props}
    />
  );
};

export default Badge;
