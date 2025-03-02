import React from 'react';

const buttonVariants = {
  primary: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold px-5 py-2.5 rounded-md shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50",
  secondary: "bg-white text-primary-700 border-2 border-primary-600 hover:bg-primary-50 font-semibold px-5 py-2.5 rounded-md shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50",
  outline: "bg-transparent text-primary-700 border-2 border-primary-600 hover:bg-primary-50 font-semibold px-5 py-2.5 rounded-md shadow-sm transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50",
  ghost: "bg-transparent text-primary-700 hover:bg-primary-50 font-semibold px-5 py-2.5 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50",
  link: "bg-transparent text-primary-700 hover:text-primary-800 underline font-semibold px-2 py-1 transition-all duration-300 focus:outline-none",
  danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-5 py-2.5 rounded-md shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
};

const buttonSizes = {
  sm: "text-sm px-3 py-1.5",
  md: "text-base px-5 py-2.5",
  lg: "text-lg px-6 py-3",
  xl: "text-xl px-8 py-4",
};

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
  const baseClasses = buttonVariants[variant] || buttonVariants.primary;
  const sizeClasses = buttonSizes[size] || buttonSizes.md;
  const combinedClasses = `${baseClasses} ${sizeClasses} ${className} ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''} flex items-center justify-center gap-2`;
  
  return (
    <Component
      className={combinedClasses}
      disabled={Component === "button" ? disabled || isLoading : undefined}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span>{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span>{rightIcon}</span>}
    </Component>
  );
};

export default Button;
