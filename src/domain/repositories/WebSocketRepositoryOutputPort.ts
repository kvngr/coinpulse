import { type Price } from "@domain/entities/Price";
import { type Trade } from "@domain/entities/Trade";
import { type ContractAddress } from "@domain/value-objects/ContractAddress";

export type PriceUpdateCallback = (price: Price) => void;
export type TradeUpdateCallback = (trade: Trade) => void;
export type ErrorCallback = (error: Error) => void;

/**
 * WebSocketRepositoryOutputPort - Port (Interface)
 * Defines the contract for real-time data updates
 * Infrastructure layer will implement this interface
 */
export interface WebSocketRepositoryOutputPort {
  /**
   * Connect to WebSocket
   */
  connect(): Promise<void>;

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void;

  /**
   * Subscribe to price updates for a token
   * @param contractAddress - The token's contract address
   * @param callback - Function called when price updates
   * @returns Unsubscribe function
   */
  subscribeToPriceUpdates(
    contractAddress: ContractAddress,
    callback: PriceUpdateCallback,
  ): () => void;

  /**
   * Subscribe to trade updates for a token
   * @param contractAddress - The token's contract address
   * @param callback - Function called when new trade occurs
   * @returns Unsubscribe function
   */
  subscribeToTradeUpdates(
    contractAddress: ContractAddress,
    callback: TradeUpdateCallback,
  ): () => void;

  /**
   * Register error handler
   * @param callback - Function called on WebSocket errors
   */
  onError(callback: ErrorCallback): void;

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean;
}
