// src/components/ui/dialog.js
import React from "react";

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

const DialogHeader = ({ children, className = "" }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

const DialogTitle = ({ children, className = "" }) => {
  return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
};

const DialogDescription = ({ children, className = "" }) => {
  return <p className={`text-gray-500 mt-1 ${className}`}>{children}</p>;
};

const DialogFooter = ({ children, className = "" }) => {
  return (
    <div
      className={`mt-6 flex justify-end items-center space-x-2 ${className}`}
    >
      {children}
    </div>
  );
};

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};