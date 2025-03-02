import React from 'react';
import { Badge as MantineBadge } from '@mantine/core';

const Badge = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  // Map custom variants to Mantine colors
  const colorMap = {
    primary: "primary",
    secondary: "gray",
    success: "green",
    warning: "yellow",
    danger: "red",
    info: "blue",
  };
  
  // Map custom sizes to Mantine sizes
  const sizeMap = {
    sm: "xs",
    md: "sm",
    lg: "md",
  };
  
  return (
    <MantineBadge
      color={colorMap[variant] || "primary"}
      size={sizeMap[size] || "sm"}
      className={className}
      radius="md"
      {...props}
    >
      {children}
    </MantineBadge>
  );
};

export default Badge;
