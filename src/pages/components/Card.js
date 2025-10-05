import React from 'react';

const Card = ({ children, className = '', hover = false }) => (
    <div className={`
        rounded-2xl bg-white border border-gray-100
        ${hover ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : 'shadow-sm'}
        transition-all duration-300
        ${className}
      `}>
        {children}
    </div>
);

export default Card;