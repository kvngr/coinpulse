/**
 * Time and Date Utilities
 */

/**
 * Time unit thresholds in seconds
 * Used to determine the most appropriate unit for relative time formatting
 */
const TIME_UNITS = [
  { unit: "year", seconds: 31536000 },
  { unit: "month", seconds: 2592000 },
  { unit: "week", seconds: 604800 },
  { unit: "day", seconds: 86400 },
  { unit: "hour", seconds: 3600 },
  { unit: "minute", seconds: 60 },
  { unit: "second", seconds: 1 },
] as const;

/**
 * Get the appropriate time unit and value for a given difference in seconds
 * @param diffInSeconds - Time difference in seconds
 * @returns Object with unit and value
 */
function getBestTimeUnit(diffInSeconds: number): {
  unit: Intl.RelativeTimeFormatUnit;
  value: number;
} {
  const absDiff = Math.abs(diffInSeconds);

  for (const { unit, seconds } of TIME_UNITS) {
    if (absDiff >= seconds) {
      return {
        unit: unit as Intl.RelativeTimeFormatUnit,
        value: Math.floor(diffInSeconds / seconds),
      };
    }
  }

  return { unit: "second", value: 0 };
}

/**
 * Format timestamp to relative time using Intl.RelativeTimeFormat
 *
 * Note: Intl.RelativeTimeFormat requires explicit unit specification.
 * It doesn't automatically determine whether "120 minutes" should be "2 hours".
 * We calculate the best unit, then let Intl handle localization and pluralization.
 *
 * @param timestamp - The timestamp to format (Date, string, or number)
 * @param locale - Locale string (default: "en-US")
 * @returns Relative time string (e.g., "2 minutes ago", "1 hour ago")
 */
export function formatRelativeTime(
  timestamp: Date | string | number,
  locale: string = "en-US",
): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const { unit, value } = getBestTimeUnit(diffInSeconds);

  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
    style: "long",
  });

  return rtf.format(-value, unit);
}

/**
 * Format timestamp to short relative time (e.g., "2 min. ago", "1 hr. ago")
 * @param timestamp - The timestamp to format (Date, string, or number)
 * @param locale - Locale string (default: "en-US")
 * @returns Short relative time string
 */
export function formatRelativeTimeShort(
  timestamp: Date | string | number,
  locale: string = "en-US",
): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const { unit, value } = getBestTimeUnit(diffInSeconds);

  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
    style: "short",
  });

  return rtf.format(-value, unit);
}

/**
 * Sleep utility - delays execution for a specified duration
 * @param ms - Duration in milliseconds
 * @returns Promise that resolves after the specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format a date to a readable string using Intl.DateTimeFormat
 * @param date - The date to format
 * @param locale - Locale string (default: "en-US")
 * @param options - Optional Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  locale: string = "en-US",
  options?: Intl.DateTimeFormatOptions,
): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
  return formatter.format(new Date(date));
}

/**
 * Format a date and time to a readable string using Intl.DateTimeFormat
 * @param date - The date to format
 * @param locale - Locale string (default: "en-US")
 * @param options - Optional Intl.DateTimeFormatOptions
 * @returns Formatted date and time string
 */
export function formatDateTime(
  date: Date | string | number,
  locale: string = "en-US",
  options?: Intl.DateTimeFormatOptions,
): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  });
  return formatter.format(new Date(date));
}

/**
 * Format time only using Intl.DateTimeFormat
 * @param date - The date to format
 * @param locale - Locale string (default: "en-US")
 * @param options - Optional Intl.DateTimeFormatOptions
 * @returns Formatted time string
 */
export function formatTime(
  date: Date | string | number,
  locale: string = "en-US",
  options?: Intl.DateTimeFormatOptions,
): string {
  const formatter = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    ...options,
  });
  return formatter.format(new Date(date));
}
