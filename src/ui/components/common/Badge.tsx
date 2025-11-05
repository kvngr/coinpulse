import { type ReactNode } from "react";

import { cn } from "@shared/utils/cn";

type BadgeVariant = "success" | "danger" | "info" | "warning" | "purple";

type BadgeSize = "sm" | "md" | "lg";

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: BadgeSize;
};

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-green-500/20 text-green-400 border-green-500/30",
  danger: "bg-red-500/20 text-red-400 border-red-500/30",
  info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "info",
  size = "sm",
  className,
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};
