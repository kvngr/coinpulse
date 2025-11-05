/**
 * Shared TypeScript Types
 * Common types used across the application
 */

export interface GridPosition {
  x: number;
  y: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export type Nullable<T> = T | null;

export type AsyncResult<T, E = Error> = Promise<
  { success: true; data: T } | { success: false; error: E }
>;

/**
 * WebSocket message types
 */
export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
}

/**
 * Price data from API
 */
export interface PriceData {
  contractAddress: string;
  priceUSD: number;
  priceSOL: number;
  variation24h: number;
  timestamp?: string;
}

/**
 * Trade data from API
 */
export interface TradeData {
  id: string;
  contractAddress: string;
  walletAddress: string;
  amount: number;
  currency: string;
  type: "BUY" | "SELL";
  timestamp: string;
  transactionHash: string;
}

/**
 * Widget data for serialization
 */
export interface WidgetData {
  id: string;
  type: "LIVE_PRICE" | "TRADE_FEED";
  contractAddress: string;
  position: GridPosition;
  config?: Record<string, unknown>;
}
