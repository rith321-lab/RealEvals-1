import React from 'react';

const spinnerSizes = {
  xs: "h-3 w-3 border-2",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-3",
  xl: "h-12 w-12 border-4",
};

const Spinner = ({
  size = "md",
  variant = "primary",
  className = "",
  ...props
}) => {
  const sizeClasses = spinnerSizes[size] || spinnerSizes.md;
  
  const variantClasses = {
    primary: "border-primary-200 border-t-primary-600",
    secondary: "border-secondary-200 border-t-secondary-600",
    white: "border-white/30 border-t-white",
  };
  
  const baseClasses = variantClasses[variant] || variantClasses.primary;
  
  return (
    <div
      className={`inline-block rounded-full animate-spin ${sizeClasses} ${baseClasses} ${className}`}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
