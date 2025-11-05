/**
 * Mobula Data Validators
 * Reusable validation functions for Mobula API responses
 */

/**
 * Validate trade timestamp
 */
export function isValidTimestamp(timestamp: unknown): timestamp is number {
  return (
    typeof timestamp === "number" && Number.isFinite(timestamp) && timestamp > 0
  );
}

/**
 * Validate trade hash
 */
export function isValidHash(hash: unknown): hash is string {
  return typeof hash === "string" && hash.length > 0;
}

/**
 * Validate wallet/sender address
 */
export function isValidAddress(address: unknown): address is string {
  return typeof address === "string" && address.length > 0;
}

/**
 * Validate complete trade data (REST API)
 */
export function isValidTradeData(trade: {
  hash?: unknown;
  timestamp?: unknown;
}): boolean {
  return isValidHash(trade.hash) && isValidTimestamp(trade.timestamp);
}

/**
 * Validate complete trade message (WebSocket)
 */
export function isValidTradeMessage(message: {
  hash?: unknown;
  date?: unknown;
  sender?: unknown;
}): boolean {
  return (
    isValidHash(message.hash) &&
    isValidTimestamp(message.date) &&
    isValidAddress(message.sender)
  );
}
