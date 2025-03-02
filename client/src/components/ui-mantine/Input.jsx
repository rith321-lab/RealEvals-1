import React from 'react';
import { TextInput } from '@mantine/core';

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
  return (
    <TextInput
      label={label}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      description={!error ? helperText : null}
      required={required}
      disabled={disabled}
      className={className}
      leftSection={startAdornment}
      rightSection={endAdornment}
      {...props}
    />
  );
};

export default Input;
