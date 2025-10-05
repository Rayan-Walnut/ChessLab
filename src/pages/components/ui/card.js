import React from "react";
import clsx from "clsx";

/**
 * Card component
 *
 * @param {string} className - Extra Tailwind classes.
 * @param {React.ReactNode} children - Card content.
 * @param {"none"|"sm"|"md"|"lg"|"xl"} shadow - Shadow size.
 * @param {0|1|2|3|4|5|6} padding - Padding scale.
 * @param {boolean} hoverable - Lift‑up effect on hover.
 */
const Card = React.forwardRef(
  (
    {
      className = "",
      children,
      shadow = "md",
      padding = 4,
      hoverable = false,
      ...props
    },
    ref
  ) => {
    const shadowClasses = {
      none: "",
      sm: "shadow-sm",
      md: "shadow",
      lg: "shadow-lg",
      xl: "shadow-xl",
    };

    const paddingClasses = {
      0: "p-0",
      1: "p-1",
      2: "p-2",
      3: "p-3",
      4: "p-4",
      5: "p-5",
      6: "p-6",
    };

    return (
      <div
        ref={ref}
        className={clsx(
          "bg-white rounded-lg",
          shadowClasses[shadow],
          paddingClasses[padding],
          hoverable && "transition-transform hover:-translate-y-1 hover:shadow-xl",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;