/**
 * ID Generation Utilities
 */

/**
 * Generate a unique ID using Web Crypto API
 * @returns A cryptographically secure UUID v4
 */
export function generateId(): string {
  // Use native crypto.randomUUID if available (Node 19+, modern browsers)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback: Generate UUID v4 using crypto.getRandomValues
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // Set version (4) and variant bits
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10

    // Convert to UUID string format
    const hex = Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  // Final fallback (should never reach in modern environments)
  throw new Error("Crypto API not available for generating secure IDs");
}
