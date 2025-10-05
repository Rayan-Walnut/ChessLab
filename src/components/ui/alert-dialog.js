// src/components/ui/alert-dialog.js
import React from "react";
import { Button } from "./button";

const AlertDialog = ({ open, onOpenChange, children }) => {
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
        className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const AlertDialogContent = ({ children, className = "" }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

const AlertDialogHeader = ({ children, className = "" }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

const AlertDialogTitle = ({ children, className = "" }) => {
  return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
};

const AlertDialogDescription = ({ children, className = "" }) => {
  return <p className={`text-gray-500 mt-1 ${className}`}>{children}</p>;
};

const AlertDialogFooter = ({ children, className = "" }) => {
  return (
    <div
      className={`mt-6 flex justify-end items-center space-x-2 ${className}`}
    >
      {children}
    </div>
  );
};

const AlertDialogCancel = ({ children, onClick, className = "" }) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={`border-gray-300 ${className}`}
    >
      {children || "Annuler"}
    </Button>
  );
};

const AlertDialogAction = ({ children, onClick, className = "" }) => {
  return (
    <Button
      onClick={onClick}
      className={`bg-blue-600 hover:bg-blue-700 text-white ${className}`}
    >
      {children || "Confirmer"}
    </Button>
  );
};

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
};