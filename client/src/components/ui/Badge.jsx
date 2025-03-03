import React from 'react';

const badgeVariants = {
  default: "bg-primary-100 text-primary-800 border border-primary-200",
  primary: "bg-primary-100 text-primary-800 border border-primary-200",
  secondary: "bg-secondary-100 text-secondary-800 border border-secondary-200",
  success: "bg-green-100 text-green-800 border border-green-200",
  danger: "bg-red-100 text-red-800 border border-red-200",
  warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  info: "bg-blue-100 text-blue-800 border border-blue-200",
  outline: "bg-transparent border border-primary-300 text-primary-700",
};

const Badge = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseClasses = badgeVariants[variant] || badgeVariants.default;
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
