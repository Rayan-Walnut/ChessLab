"use client";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import clsx from "clsx";

/* --------------------------------------------------------------------------
   Mini-Select (Trigger / Content / Item) – sans headless-ui, façon shadcn
   Exemple :

   <Select value={role} onValueChange={setRole} className="w-48">
     <Select.Trigger />
     <Select.Content>
       <Select.Item value="admin">Admin</Select.Item>
       <Select.Item value="user">User</Select.Item>
     </Select.Content>
   </Select>
-------------------------------------------------------------------------- */

const SelectCtx = createContext();

export default function Select({
  value: controlled,
  defaultValue,
  onValueChange,
  placeholder = "Choisir…",
  disabled,
  className,
  children,
}) {
  const [val, setVal] = useState(controlled ?? defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const setValue = (v) => {
    if (controlled === undefined) setVal(v);
    onValueChange?.(v);
    setOpen(false);
  };

  // click outside pour fermer
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const ctx = {
    value: controlled ?? val,
    open,
    setOpen,
    setValue,
    placeholder,
    disabled,
  };

  return (
    <SelectCtx.Provider value={ctx}>
      <div ref={containerRef} className={className}>
        {children}
      </div>
    </SelectCtx.Provider>
  );
}

/* ----------------------------- Helper hooks ------------------------------ */
const useSelect = () => {
  const c = useContext(SelectCtx);
  if (!c) throw new Error("Select components must be inside <Select />");
  return c;
};

/* ----------------------------- Sub-components ---------------------------- */
Select.Trigger = function SelectTrigger({
  className,
  icon = "▼",
  ...props
}) {
  const { value, placeholder, open, setOpen, disabled } = useSelect();
  return (
    <button
      type="button"
      disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={() => !disabled && setOpen((o) => !o)}
      className={clsx(
        "w-full border rounded px-3 py-1.5 text-left flex justify-between items-center gap-2",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      <span>{value || placeholder}</span>
      <span className="text-xs opacity-60">{icon}</span>
    </button>
  );
};

Select.Content = function SelectContent({ className, children }) {
  const { open } = useSelect();
  if (!open) return null;
  return (
    <ul
      role="listbox"
      className={clsx(
        "mt-1 w-full max-h-60 overflow-y-auto border rounded shadow-lg bg-white z-50 absolute",
        className
      )}
    >
      {children}
    </ul>
  );
};

Select.Item = function SelectItem({ value, children, className }) {
  const { value: active, setValue } = useSelect();
  return (
    <li
      role="option"
      aria-selected={active === value}
      tabIndex={0}
      onClick={() => setValue(value)}
      onKeyDown={(e) => e.key === "Enter" && setValue(value)}
      className={clsx(
        "px-3 py-1.5 cursor-pointer select-none text-sm",
        active === value
          ? "bg-indigo-600 text-white"
          : "hover:bg-gray-100 text-gray-700",
        className
      )}
    >
      {children}
    </li>
  );
};