import React from "react";
import clsx from "clsx";

const Button = React.forwardRef(
  (
    {
      className = "",
      type = "button",
      children,
      onClick,
      disabled = false,
      variant = "primary",
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition";

    const variants = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
      secondary:
        "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400 disabled:bg-gray-100 disabled:text-gray-400",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          base,
          variants[variant],
          disabled && "cursor-not-allowed",
          className
        )}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;