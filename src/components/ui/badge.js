// src/components/ui/badge.js
import React from "react";

const badgeVariants = {
  default: "bg-gray-100 text-gray-800",
  primary: "bg-blue-100 text-blue-800",
  secondary: "bg-gray-100 text-gray-800",
  destructive: "bg-red-100 text-red-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  outline: "border border-gray-200 bg-transparent",
};

const Badge = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };