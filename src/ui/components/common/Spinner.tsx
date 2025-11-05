import { cn } from "@shared/utils/cn";

type SpinnerSize = "sm" | "md" | "lg";

type SpinnerProps = {
  size?: SpinnerSize;
  className?: string;
};

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-3",
  lg: "h-12 w-12 border-4",
};

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-blue-600 border-t-transparent",
          sizeClasses[size],
          className,
        )}
      />
    </div>
  );
};
