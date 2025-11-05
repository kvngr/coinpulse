import {
  type WebSocketRepositoryOutputPort,
  type PriceUpdateCallback,
  type TradeUpdateCallback,
  type ErrorCallback,
} from "@domain/repositories/WebSocketRepositoryOutputPort";
import { type ContractAddress } from "@domain/value-objects/ContractAddress";
import { WEBSOCKET_URLS } from "@shared/constants";

import { PriceWebSocketService } from "./PriceWebSocketService";
import { TradeWebSocketService } from "./TradeWebSocketService";
import { WebSocketClient } from "./WebSocketClient";

/**
 * Mobula WebSocket Client
 * Combines the generic WebSocket client with specialized services
 * Implements the WebSocketRepositoryOutputPort interface
 *
 * Architecture:
 * - WebSocketClient: Low-level WebSocket connection management
 * - PriceWebSocketService: Business logic for price subscriptions
 * - TradeWebSocketService: Business logic for trade subscriptions
 * - MobulaWebSocketClient: Unified interface for the application
 */
export class MobulaWebSocketClient implements WebSocketRepositoryOutputPort {
  private webSocketClient: WebSocketClient;
  private priceService: PriceWebSocketService;
  private tradeService: TradeWebSocketService;

  constructor() {
    this.webSocketClient = new WebSocketClient(WEBSOCKET_URLS.WS_MOBULA);
    this.priceService = new PriceWebSocketService(this.webSocketClient);
    this.tradeService = new TradeWebSocketService(this.webSocketClient);
    console.info("[MobulaWebSocketClient] Initialized");
  }

  /**
   * Connect to WebSocket server
   */
  async connect(): Promise<void> {
    await this.webSocketClient.connect();

    this.priceService.setupHandlers();
    this.tradeService.setupHandlers();

    // Send subscriptions for both services if there are any
    this.priceService.sendSubscription();
    this.tradeService.sendSubscription();
  }

  /**
   * Disconnect from WebSocket server
   * Note: Does NOT clear handlers - they persist for reconnection
   * Only clears subscription data
   */
  disconnect(): void {
    console.info("[MobulaWebSocketClient] Disconnecting (keeping handlers)");
    this.webSocketClient.disconnect();
  }

  /**
   * Complete cleanup - removes all handlers and subscriptions
   * Should only be called on final unmount/cleanup
   */
  cleanup(): void {
    console.info("[MobulaWebSocketClient] Full cleanup (removing handlers)");
    this.priceService.unsubscribeAll();
    this.tradeService.unsubscribeAll();
    this.webSocketClient.disconnect();
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.webSocketClient.isConnected();
  }

  /**
   * Subscribe to price updates for a token
   * Returns an unsubscribe function
   */
  subscribeToPriceUpdates(
    contractAddress: ContractAddress,
    callback: PriceUpdateCallback,
  ): () => void {
    return this.priceService.subscribe(contractAddress, callback);
  }

  /**
   * Subscribe to trade updates for a token
   * Returns an unsubscribe function
   */
  subscribeToTradeUpdates(
    contractAddress: ContractAddress,
    callback: TradeUpdateCallback,
  ): () => void {
    return this.tradeService.subscribe(contractAddress, callback);
  }

  /**
   * Register error handler
   */
  onError(callback: ErrorCallback): void {
    this.webSocketClient.onError(callback);
  }
}

// Singleton instance
export const webSocketClient = new MobulaWebSocketClient();
