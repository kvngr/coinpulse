import { cn } from "@shared/utils/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const Card: React.FC<CardProps> = ({ children, onClick, className }) => {
  return (
    <div
      className={cn(
        "h-fit rounded-xl border border-gray-800 bg-gray-900 shadow-lg",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
