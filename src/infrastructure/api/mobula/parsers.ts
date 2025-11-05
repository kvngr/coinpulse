/**
 * Mobula API Message Parsers
 * Utility functions to extract and normalize data from Mobula API responses
 * Handles inconsistent field naming (camelCase vs snake_case)
 */

/**
 * Extracts a numeric value from multiple possible field names
 * Returns the first valid (finite, positive) number found, or null
 */
function extractNumericField(
  obj: Record<string, unknown>,
  fieldNames: string[],
): number | null {
  for (const fieldName of fieldNames) {
    const value = obj[fieldName];
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      return value;
    }
  }
  return null;
}

/**
 * Extract trade amount (in USD) from Mobula trade message
 * Tries multiple field names in priority order
 */
export function extractTradeAmount(
  tradeMessage: Record<string, unknown>,
): number | null {
  return extractNumericField(tradeMessage, [
    "tokenAmountUsd",
    "token_amount_usd",
    "tokenAmountVs",
    "tokenAmount",
    "token_amount",
  ]);
}

/**
 * Extract token price from Mobula trade message
 */
export function extractTokenPrice(
  tradeMessage: Record<string, unknown>,
): number | null {
  return extractNumericField(tradeMessage, [
    "tokenPrice", // camelCase
    "token_price", // snake_case
  ]);
}

/**
 * Extract USD price from Mobula price message
 * Tries multiple field names in priority order
 */
export function extractPriceUSD(
  priceMessage: Record<string, unknown>,
): number | null {
  return extractNumericField(priceMessage, [
    "priceUSD",
    "price_usd",
    "priceUsd",
    "price",
    "priceToken",
  ]);
}

/**
 * Extract SOL price from Mobula price message
 * For tokens priced in SOL
 */
export function extractPriceSOL(
  priceMessage: Record<string, unknown>,
): number | null {
  // For SOL-based prices, allow 0 (some tokens might be valueless)
  for (const fieldName of [
    "priceToken",
    "price_token",
    "priceSOL",
    "price_sol",
  ]) {
    const value = priceMessage[fieldName];
    if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
      return value;
    }
  }
  return null;
}

/**
 * Extract token address from Mobula trade message
 * Handles both simple (token: string) and enriched (tokenData: {...}) formats
 */
export function extractTokenAddress(
  tradeMessage: Record<string, unknown>,
): string | null {
  // Try simple format: token field as string
  const tokenField = tradeMessage.token;
  if (typeof tokenField === "string" && tokenField.length > 0) {
    return tokenField;
  }

  // Try enriched format: tokenData.address
  const tokenData = tradeMessage.tokenData;
  if (
    tokenData !== null &&
    typeof tokenData === "object" &&
    tokenData !== undefined
  ) {
    const tokenDataObj = tokenData as Record<string, unknown>;
    const address = tokenDataObj.address;
    if (typeof address === "string" && address.length > 0) {
      return address;
    }
  }

  return null;
}
