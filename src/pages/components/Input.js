import React from 'react';

const Input = ({ icon: Icon, className = '', ...props }) => (
    <div className="relative">
        {Icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Icon size={20} />
            </div>
        )}
        <input
            className={`w-full py-3 ${Icon ? 'pl-12' : ''} rounded-lg bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300 ${className}`}
            {...props}
        />
    </div>
);

export default Input;