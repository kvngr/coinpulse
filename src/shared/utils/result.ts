export type Result<T, E = unknown> =
  | { outcome: "success"; value: T }
  | { outcome: "failed"; error: E; cause?: string };

export function ok<T>(value: T): Result<T, never> {
  return {
    outcome: "success",
    value,
  };
}

export function err<E>(error: E, cause?: string): Result<never, E> {
  return {
    outcome: "failed",
    error,
    cause,
  };
}
