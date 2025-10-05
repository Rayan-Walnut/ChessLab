import React from "react";

const Input = React.forwardRef(({ 
  className = "", 
  type = "text", 
  placeholder = "", 
  value, 
  onChange, 
  disabled = false,
  id,
  name,
  required = false,
  autoComplete,
  onKeyDown,
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={`px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      } ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      id={id}
      name={name}
      required={required}
      autoComplete={autoComplete}
      onKeyDown={onKeyDown}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;