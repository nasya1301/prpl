import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md h-fit font-medium transition-colors duration-200 focus:outline-none";

  const variants = {
    primary: "bg-[#0479CE] text-white hover:bg-sky-700",
    danger: "bg-[#DC2626] text-white hover:bg-red-700",
    neutral: "bg-white text-black hover:bg-gray-200",
    solid: ""
  };

  const sizes = {
    sm: "px-2.5 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed" : "";

  const buttonClassName = `${base} ${variants[variant]} ${sizes[size]} ${disabledStyle} ${className}`;

  return (
    <button className={buttonClassName} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;