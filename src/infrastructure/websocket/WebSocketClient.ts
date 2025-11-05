import { websocketConfig, getMobulaApiKey } from "@config/websocket.config";

/**
 * Generic WebSocket Client
 * Handles low-level WebSocket connection, reconnection, and message passing
 * No business logic - just raw WebSocket functionality
 */
export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private messageHandlers: Set<(data: string) => void> = new Set();
  private errorHandlers: Set<(error: Error) => void> = new Set();
  private readonly apiKey: string;
  private readonly wsUrl: string;

  constructor(wsUrl: string) {
    this.wsUrl = wsUrl;
    this.apiKey = getMobulaApiKey();
  }

  /**
   * Connect to WebSocket server
   */
  async connect(): Promise<void> {
    if (this.isConnected()) {
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const urlWithAuth = `${this.wsUrl}?apiKey=${this.apiKey}`;

        this.ws = new WebSocket(urlWithAuth);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          this.notifyError(new Error("WebSocket connection error"));
          reject(error);
        };

        this.ws.onclose = (event) => {
          console.warn(
            "[WebSocket] Connection closed:",
            event.code,
            event.reason,
          );
          // this.stopHeartbeat();

          if (
            websocketConfig.reconnect &&
            this.reconnectAttempts < websocketConfig.reconnectAttempts
          ) {
            this.scheduleReconnect();
          }
        };
      } catch (error) {
        console.error("[WebSocket] Failed to connect:", error);
        this.notifyError(
          error instanceof Error ? error : new Error("Connection failed"),
        );
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    console.info("[WebSocket] Disconnecting...");

    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // this.stopHeartbeat();

    if (this.ws !== null) {
      this.ws.close();
      this.ws = null;
    }

    console.info("[WebSocket] Disconnected");
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Send a message through WebSocket
   */
  sendMessage(message: unknown): void {
    if (this.ws === null || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("[WebSocket] Cannot send message: not connected");
      return;
    }

    try {
      this.ws.send(JSON.stringify(message));
      console.info(
        "[WebSocket] Message sent:",
        (message as { type?: string }).type,
      );
    } catch (error) {
      console.error("[WebSocket] Failed to send message:", error);
    }
  }

  /**
   * Register a message handler
   */
  onMessage(handler: (data: string) => void): () => void {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  /**
   * Register an error handler
   */
  onError(handler: (error: Error) => void): () => void {
    this.errorHandlers.add(handler);
    return () => {
      this.errorHandlers.delete(handler);
    };
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: string): void {
    if (this.messageHandlers.size === 0) {
      console.warn("[WebSocket] ⚠️ NO HANDLERS REGISTERED!");
    }

    this.messageHandlers.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error("[WebSocket] Message handler error:", error);
      }
    });
  }

  /**
   * Notify all error handlers
   */
  private notifyError(error: Error): void {
    this.errorHandlers.forEach((handler) => {
      try {
        handler(error);
      } catch (err) {
        console.error("[WebSocket] Error handler failed:", err);
      }
    });
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer !== null) {
      return;
    }

    this.reconnectAttempts++;
    const delay = websocketConfig.reconnectInterval;

    console.info(
      `[WebSocket] Scheduling reconnect attempt ${this.reconnectAttempts}/${websocketConfig.reconnectAttempts} in ${delay}ms`,
    );

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect().catch((error) => {
        console.error("[WebSocket] Reconnect failed:", error);
      });
    }, delay);
  }
}
