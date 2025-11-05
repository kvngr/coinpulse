import { type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@shared/utils/cn";

type ButtonSize = "sm" | "md" | "lg";

type ButtonVariant = "primary" | "secondary" | "danger" | "neutral";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const baseClasses =
  "rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 ease-in-out cursor-pointer";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700",
  neutral: "",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-2 py-1.5 text-sm",
  md: "px-3 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        variant === "neutral" ? "" : baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
