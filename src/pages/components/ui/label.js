"use client";
import React from "react";
import clsx from "clsx";

/* --------------------------------------------------------------------------
   Label – mini équivalent shadcn/ui
   Usage : <Label htmlFor="email">Adresse e-mail</Label>
-------------------------------------------------------------------------- */

const Label = React.forwardRef(function Label(
  { htmlFor, className, children, ...props },
  ref
) {
  return (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={clsx("text-sm font-medium text-gray-700", className)}
      {...props}
    >
      {children}
    </label>
  );
});

export default Label;