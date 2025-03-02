import React from 'react';
import { Card as MuiCard, CardHeader as MuiCardHeader, CardContent as MuiCardContent, CardActions, Typography, Box } from '@mui/material';

const CardHeader = ({ children, className = "", ...props }) => (
  <Box className={`p-4 ${className}`} {...props}>
    {children}
  </Box>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <Typography variant="h6" className={className} {...props}>
    {children}
  </Typography>
);

const CardDescription = ({ children, className = "", ...props }) => (
  <Typography variant="body2" color="text.secondary" className={className} {...props}>
    {children}
  </Typography>
);

const CardContent = ({ children, className = "", ...props }) => (
  <MuiCardContent className={className} {...props}>
    {children}
  </MuiCardContent>
);

const CardFooter = ({ children, className = "", ...props }) => (
  <CardActions className={`border-t border-gray-200 ${className}`} {...props}>
    {children}
  </CardActions>
);

const Card = ({ children, variant = "default", className = "", ...props }) => {
  // Map variants to MUI props
  const variantProps = {
    default: { elevation: 1 },
    elevated: { elevation: 3 },
    filled: { elevation: 0, sx: { backgroundColor: 'grey.100' } },
    flat: { elevation: 0 },
    outline: { variant: "outlined", elevation: 0 },
  };
  
  return (
    <MuiCard 
      className={className}
      {...variantProps[variant] || variantProps.default}
      {...props}
    >
      {children}
    </MuiCard>
  );
};

export default Card;
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
