import { cn } from "@shared/utils/cn";

type ButtonSize = "sm" | "md" | "lg";

type ButtonVariant = "primary" | "secondary" | "danger" | "neutral";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const baseClasses =
  "rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 ease-in-out cursor-pointer flex items-center justify-center";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 border border-indigo-500 text-white hover:bg-indigo-700",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700",
  neutral: "",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-2 py-1.5 text-sm h-6",
  md: "px-3 py-2 text-sm h-8",
  lg: "px-6 py-3 text-base h-10",
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
        variant !== "neutral" ? baseClasses : undefined,
        variantClasses[variant],
        variant !== "neutral" ? sizeClasses[size] : undefined,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
