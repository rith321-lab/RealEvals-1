import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const alertVariants = {
  default: "bg-primary-50 text-primary-800 border-primary-200",
  primary: "bg-primary-50 text-primary-800 border-primary-200",
  success: "bg-green-50 text-green-800 border-green-200",
  warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  error: "bg-red-50 text-red-800 border-red-200",
  info: "bg-blue-50 text-blue-800 border-blue-200",
};

const alertIcons = {
  default: <FiInfo className="h-5 w-5" />,
  primary: <FiInfo className="h-5 w-5" />,
  success: <FiCheckCircle className="h-5 w-5" />,
  warning: <FiAlertTriangle className="h-5 w-5" />,
  error: <FiAlertCircle className="h-5 w-5" />,
  info: <FiInfo className="h-5 w-5" />,
};

const Alert = ({
  children,
  variant = "default",
  title,
  icon,
  className = "",
  ...props
}) => {
  const baseClasses = alertVariants[variant] || alertVariants.default;
  const alertIcon = icon || alertIcons[variant];
  
  return (
    <div
      className={`flex items-start p-4 rounded-md border ${baseClasses} ${className}`}
      role="alert"
      {...props}
    >
      {alertIcon && (
        <div className="flex-shrink-0 mr-3 mt-0.5">
          {alertIcon}
        </div>
      )}
      <div>
        {title && (
          <h3 className="text-sm font-medium mb-1">{title}</h3>
        )}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
};

export default Alert;
