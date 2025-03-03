import React from 'react';

const Input = ({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = '',
  required = false,
  disabled = false,
  helperText,
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-secondary-800 mb-1.5"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full rounded-md border ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-primary-200 focus:ring-primary-500 focus:border-primary-500'} px-3 py-2.5 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white shadow-sm transition-all duration-200 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-secondary-500">{helperText}</p>}
    </div>
  );
};

export default Input;
