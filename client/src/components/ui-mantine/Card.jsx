import React from 'react';
import { Card as MantineCard, Text, Group, Box } from '@mantine/core';

const CardHeader = ({ children, className = "", ...props }) => (
  <Box className={`p-4 ${className}`} {...props}>
    {children}
  </Box>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <Text size="lg" fw={600} className={className} {...props}>
    {children}
  </Text>
);

const CardDescription = ({ children, className = "", ...props }) => (
  <Text size="sm" c="dimmed" className={className} {...props}>
    {children}
  </Text>
);

const CardContent = ({ children, className = "", ...props }) => (
  <Box className={className} {...props}>
    {children}
  </Box>
);

const CardFooter = ({ children, className = "", ...props }) => (
  <Group className={`border-t border-gray-200 p-4 ${className}`} {...props}>
    {children}
  </Group>
);

const Card = ({ children, variant = "default", className = "", ...props }) => {
  // Map variants to Mantine props
  const variantProps = {
    default: { shadow: "sm" },
    elevated: { shadow: "md" },
    filled: { bg: "gray.0" },
    flat: { shadow: "none" },
    outline: { withBorder: true, shadow: "none" },
  };
  
  return (
    <MantineCard 
      className={className}
      radius="lg"
      p="lg"
      {...variantProps[variant] || variantProps.default}
      {...props}
    >
      {children}
    </MantineCard>
  );
};

export default Card;
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
