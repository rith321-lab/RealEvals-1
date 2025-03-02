import React from 'react';
import { Alert as MantineAlert } from '@mantine/core';
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
  // Map custom variants to Mantine colors
  const colorMap = {
    info: "blue",
    success: "green",
    warning: "yellow",
    error: "red",
  };
  
  // Default icons based on variant
  const defaultIcons = {
    info: <FiInfo size={18} />,
    success: <FiCheckCircle size={18} />,
    warning: <FiAlertTriangle size={18} />,
    error: <FiAlertCircle size={18} />,
  };
  
  // Use provided icon or default based on variant
  const alertIcon = icon || defaultIcons[variant] || defaultIcons.info;
  
  return (
    <MantineAlert
      color={colorMap[variant] || "blue"}
      title={title}
      icon={alertIcon}
      className={className}
      withCloseButton={!!onClose}
      onClose={onClose}
      {...props}
    >
      {children}
    </MantineAlert>
  );
};

export default Alert;
