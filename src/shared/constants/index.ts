/**
 * Application Constants
 */

// API Configuration
export const API_BASE_URL = "https://api.mobula.io/api/1";

// Native SOL token address
export const NATIVE_SOL_TOKEN_ADDRESS =
  "So11111111111111111111111111111111111111112";

// WebSocket URLs (Mobula Stream API)
export const WEBSOCKET_URLS = {
  WS_MOBULA: "wss://api.mobula.io",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  MARKET_DATA: "/market/data",
  PAIR_TRADES: "/market/trades/pair",
  TOKEN_METADATA: "/metadata",
} as const;

// WebSocket Message Types (Mobula Stream API)
export const WS_MESSAGE_TYPES = {
  STREAM: "stream",
  UNSUBSCRIBE: "unsubscribe",
} as const;

// WebSocket Event Types (Mobula Stream API)
export const WS_EVENTS = {
  SWAP: "swap",
  TRANSFER: "transfer",
  SWAP_ENRICHED: "swap-enriched",
} as const;

// Widget Configuration
export const WIDGET_CONFIG = {
  MIN_WIDTH: 300,
  MIN_HEIGHT: 200,
  DEFAULT_REFRESH_INTERVAL: 5000, // 5 seconds
  MAX_TRADES_DISPLAY: 20,
} as const;

// Grid Configuration
export const GRID_CONFIG = {
  COLUMNS: 12,
  ROW_HEIGHT: 100,
  GAP: 16,
  CONTAINER_PADDING: 24,
} as const;

// Data Freshness
export const DATA_STALENESS = {
  PRICE: 60000, // 1 minute
  TRADE: 30000, // 30 seconds
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  PRICE: "price",
  PRICES: "prices",
  TRADES: "trades",
  TRADE: "trade",
  WIDGETS: "widgets",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  WIDGETS: "coinpulse_widgets",
  THEME: "coinpulse_theme",
} as const;

// Animation Durations (ms)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Validation Rules
export const VALIDATION = {
  MIN_CONTRACT_ADDRESS_LENGTH: 32,
  MAX_WIDGET_LIMIT: 20,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;
