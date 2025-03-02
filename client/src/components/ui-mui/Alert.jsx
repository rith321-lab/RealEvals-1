import React from 'react';
import { Alert as MuiAlert, AlertTitle } from '@mui/material';
import { FiAlertCircle, FiInfo, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const Alert = ({
  children,
  title,
  variant = "info",
  className = "",
  icon = null,
  onClose = null,
  ...props
}) => {
  // Map custom variants to MUI severities
  const severityMap = {
    info: "info",
    success: "success",
    warning: "warning",
    error: "error",
  };
  
  // Default icons based on variant
  const defaultIcons = {
    info: <FiInfo />,
    success: <FiCheckCircle />,
    warning: <FiAlertTriangle />,
    error: <FiAlertCircle />,
  };
  
  // Use provided icon or default based on variant
  const alertIcon = icon || defaultIcons[variant] || defaultIcons.info;
  
  return (
    <MuiAlert
      severity={severityMap[variant] || "info"}
      className={className}
      icon={alertIcon}
      onClose={onClose}
      {...props}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  );
};

export default Alert;
