import React from 'react';

const Button = ({ children, variant = 'primary', className = '', icon, ...props }) => {
    const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2';
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg',
      secondary: 'bg-gray-100 text-blue-800 hover:bg-blue-200',
      outline: 'bg-white text-blue-600 border border-blue-200 hover:border-blue-600',
    };
    return (
      <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
        {icon && <span className="relative top-[1px]">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  };

export default Button;