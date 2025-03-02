import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className = "",
  startAdornment = null,
  endAdornment = null,
  ...props
}) => {
  const inputProps = {};
  
  if (startAdornment) {
    inputProps.startAdornment = (
      <InputAdornment position="start">{startAdornment}</InputAdornment>
    );
  }
  
  if (endAdornment) {
    inputProps.endAdornment = (
      <InputAdornment position="end">{endAdornment}</InputAdornment>
    );
  }
  
  return (
    <TextField
      label={label}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error || helperText}
      required={required}
      disabled={disabled}
      className={className}
      fullWidth
      variant="outlined"
      InputProps={Object.keys(inputProps).length > 0 ? inputProps : undefined}
      {...props}
    />
  );
};

export default Input;
