import { type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
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
    <div className="w-full">
      {label !== undefined ? (
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          {label}
        </label>
      ) : null}
      <input
        className={`w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none ${className} ${error ? "border-red-500" : ""}`}
        {...props}
      />
      {error !== undefined ? (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      ) : null}
    </div>
  );
};
