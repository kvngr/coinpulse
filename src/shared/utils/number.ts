/**
 * Number Utilities
 */

/**
 * Format number with locale-specific formatting
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @param locale - Locale string (default: "en-US")
 * @returns Formatted number string
 */
export function formatNumber(
  num: number,
  decimals: number = 2,
  locale: string = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Clamp a number between min and max values
 * @param value - The value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format a number as currency
 * @param value - The number to format
 * @param options - Optional Intl.NumberFormatOptions & { currency?: string; locale?: string }
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  options: Intl.NumberFormatOptions & {
    currency?: string;
    locale?: string;
  } = {},
): string {
  const { currency = "USD", locale = "en-US", ...formatOptions } = options;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    ...formatOptions,
  }).format(value);
}

/**
 * Round a number to a specific number of decimal places
 * @param value - The value to round
 * @param decimals - Number of decimal places
 * @returns Rounded value
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
