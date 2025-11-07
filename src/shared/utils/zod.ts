import { ZodError } from "zod";

/**
 * Format Zod validation errors into user-friendly messages
 * @param error - The Zod error or any error
 * @returns A formatted error message
 */
export function formatZodError(error: unknown): string {
  if (error instanceof ZodError) {
    // Extract the first error message (most relevant)
    const firstIssue = error.issues[0];
    if (firstIssue !== undefined) {
      return firstIssue.message;
    }
    return "Validation error";
  }

  // For non-Zod errors, return the message or a default
  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
}
