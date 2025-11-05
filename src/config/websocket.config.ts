/**
 * WebSocket Configuration for Mobula Stream API
 */

export interface WebSocketConfig {
  reconnect: boolean;
  reconnectInterval: number;
  reconnectAttempts: number;
  heartbeatInterval: number;
}

/**
 * Default WebSocket configuration
 */
export const websocketConfig: WebSocketConfig = {
  reconnect: true,
  reconnectInterval: 3000, // 3 seconds
  reconnectAttempts: 5,
  heartbeatInterval: 30000, // 30 seconds
};

/**
 * Get Mobula API key from environment
 */
export function getMobulaApiKey(): string {
  const apiKey = import.meta.env.VITE_MOBULA_API_KEY;
  if (apiKey === undefined || apiKey.length === 0) {
    throw new Error(
      "VITE_MOBULA_API_KEY environment variable is not set. Please add it to your .env file.",
    );
  }
  return apiKey;
}
