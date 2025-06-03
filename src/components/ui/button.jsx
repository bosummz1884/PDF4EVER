// src/components/ui/button.jsx
import React from "react";
import clsx from "clsx";

export const Button = ({ children, className, variant = "default", ...props }) => {
  const baseStyle = "inline-flex items-center px-4 py-2 text-sm font-medium rounded transition";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={clsx(baseStyle, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
