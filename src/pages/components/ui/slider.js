import React from "react";
import clsx from "clsx";

// Slider component in plain JavaScript (JSX)
const Slider = React.forwardRef(
  (
    {
      className = "",
      min = 0,
      max = 100,
      step = 1,
      value,
      onChange,
      disabled = false,
      id,
      name,
      showValue = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={clsx("flex items-center gap-2", className)}>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          disabled={disabled}
          id={id}
          name={name}
          className={clsx(
            "w-full appearance-none cursor-pointer bg-gray-200 h-2 rounded-lg outline-none",
            "focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4",
            "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-md",
            "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4",
            "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600",
          )}
          {...props}
        />
        {showValue && (
          <span className="w-12 text-right text-sm tabular-nums select-none">
            {value}
          </span>
        )}
      </div>
    );
  }
);

Slider.displayName = "Slider";

export default Slider;