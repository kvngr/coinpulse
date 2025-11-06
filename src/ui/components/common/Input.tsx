import { AnimatePresence, motion } from "motion/react";

import { cn } from "@shared/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="relative w-full">
      {label !== undefined ? (
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          {label}
        </label>
      ) : null}
      <input
        className={cn(
          "w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none",
          className,
          error !== undefined ? "border-red-500" : undefined,
        )}
        {...props}
      />
      <AnimatePresence initial={false}>
        {error !== undefined ? (
          <motion.span
            initial={{ opacity: 0, y: -20, zIndex: 0 }}
            animate={{ opacity: 1, y: 0, zIndex: 1 }}
            exit={{ opacity: 0, y: -5, zIndex: 0 }}
            className="absolute -bottom-5 left-0 text-xs font-semibold text-red-600"
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 25,
            }}
          >
            {error}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
