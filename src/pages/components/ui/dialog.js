"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";

/* --------------------------------------------------------------------------
   Lightweight modal/Dialog (shadcn‑style) – provides:
   - <Dialog>   (root, controls open state)
   - <DialogTrigger>   (opens on click)
   - <DialogContent>   (portal wrapper)
   - <DialogHeader>, <DialogTitle>, <DialogDescription>
   Usage :

   <Dialog>
     <DialogTrigger>Open</DialogTrigger>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>Title</DialogTitle>
         <DialogDescription>Subtitle</DialogDescription>
       </DialogHeader>
       body here...
     </DialogContent>
   </Dialog>
-------------------------------------------------------------------------- */

const DialogCtx = createContext();

function Dialog({ open: controlled, defaultOpen = false, onOpenChange, children }) {
  const [open, setOpen] = useState(controlled ?? defaultOpen);
  const change = (v) => {
    if (controlled === undefined) setOpen(v);
    onOpenChange?.(v);
  };
  const value = { open: controlled ?? open, change };
  return <DialogCtx.Provider value={value}>{children}</DialogCtx.Provider>;
}

function useDialog() {
  const c = useContext(DialogCtx);
  if (!c) throw new Error("Dialog components must be used inside <Dialog />");
  return c;
}

const DialogTrigger = React.forwardRef(function DialogTrigger({ asChild, children, ...props }, ref) {
  const { change } = useDialog();
  const triggerProps = {
    ...props,
    ref,
    onClick: (e) => {
      props.onClick?.(e);
      change(true);
    },
  };
  return asChild ? React.cloneElement(children, triggerProps) : <button {...triggerProps}>{children}</button>;
});

function DialogContent({ className, children, ...props }) {
  const { open, change } = useDialog();
  const contentRef = useRef(null);

  // close on Esc & click outside
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === "Escape" && change(false);
    const handleClick = (e) => contentRef.current && !contentRef.current.contains(e.target) && change(false);
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open, change]);

  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div
        ref={contentRef}
        className={clsx("bg-white rounded-lg shadow-lg max-h-[90vh] w-full max-w-lg overflow-auto p-6", className)}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

/* -------------------------- Header / Title / Desc ------------------------- */
const DialogHeader = ({ className, children }) => (
  <div className={clsx("mb-4", className)}>{children}</div>
);

const DialogTitle = ({ className, children }) => (
  <h2 className={clsx("text-lg font-semibold", className)}>{children}</h2>
);

const DialogDescription = ({ className, children }) => (
  <p className={clsx("text-sm text-gray-600", className)}>{children}</p>
);

/* ----------------------------- Named exports ----------------------------- */
Dialog.Trigger = DialogTrigger;
Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;

// ----- named & alias exports (sans double déclaration) -----
export {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog as DialogRoot,
};

export default Dialog;
