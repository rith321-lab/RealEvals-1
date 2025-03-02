import React from 'react';
import { Button as MantineButton, Loader } from '@mantine/core';

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
  // Map custom variants to Mantine variants
  const variantMap = {
    primary: "filled",
    secondary: "outline",
    outline: "outline",
    ghost: "subtle",
    link: "transparent",
    danger: "filled",
  };
  
  // Map custom sizes to Mantine sizes
  const sizeMap = {
    xs: "xs",
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
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
    <MantineButton
      variant={variantMap[variant] || "filled"}
      size={sizeMap[size] || "md"}
      color={variant === "danger" ? "error" : colorMap[variant] || "primary"}
      disabled={disabled || isLoading}
      leftSection={!isLoading && leftIcon ? leftIcon : isLoading ? <Loader size="xs" /> : null}
      rightSection={!isLoading && rightIcon ? rightIcon : null}
      className={className}
      component={Component !== "button" ? Component : undefined}
      style={linkStyle}
      {...props}
    >
      {children}
    </MantineButton>
  );
};

export default Button;
