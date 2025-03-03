import React from 'react';

const cardVariants = {
  default: "bg-white rounded-lg shadow-md border border-primary-100 overflow-hidden transition-all duration-300 hover:shadow-lg",
  gradient: "bg-gradient-to-br from-white to-primary-50 rounded-lg shadow-md border border-primary-100 overflow-hidden transition-all duration-300 hover:shadow-lg",
  elevated: "bg-white rounded-lg shadow-lg border border-primary-100 overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1",
  flat: "bg-white rounded-lg border border-primary-100 overflow-hidden transition-all duration-300 hover:border-primary-300",
  interactive: "bg-white rounded-lg shadow-md border border-primary-100 overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:scale-[1.01]"
};

const Card = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseClasses = cardVariants[variant] || cardVariants.default;
  
  return (
    <div
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-5 border-b border-primary-100 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = "", ...props }) => {
  return (
    <h3 className={`text-xl font-semibold text-secondary-900 ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = "", ...props }) => {
  return (
    <p className={`text-sm text-secondary-600 mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-5 border-t border-primary-100 bg-primary-50/30 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
