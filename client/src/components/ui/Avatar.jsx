import React from 'react';

const avatarSizes = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl",
};

const Avatar = ({
  src,
  alt,
  size = "md",
  className = "",
  fallback,
  ...props
}) => {
  const [error, setError] = React.useState(false);
  const sizeClasses = avatarSizes[size] || avatarSizes.md;
  
  const handleError = () => {
    setError(true);
  };

  return (
    <div
      className={`relative inline-block rounded-full overflow-hidden bg-primary-100 ${sizeClasses} ${className}`}
      {...props}
    >
      {!error && src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="h-full w-full object-cover"
          onError={handleError}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-700 font-medium">
          {fallback || alt?.charAt(0).toUpperCase() || "U"}
        </div>
      )}
    </div>
  );
};

export default Avatar;
