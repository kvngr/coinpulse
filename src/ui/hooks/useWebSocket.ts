import React from "react";

import { webSocketClient } from "@infrastructure/websocket/MobulaWebSocketClient";

/**
 * Hook to manage WebSocket connection
 */
export const useWebSocket = () => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    // Connect to WebSocket
    webSocketClient
      .connect()
      .then(() => {
        setIsConnected(true);
        setError(null);
      })
      .catch((error) => {
        setIsConnected(false);
        setError(error);
      });

    // Register error handler
    webSocketClient.onError((error) => {
      setError(error);
    });

    return () => {
      webSocketClient.cleanup();
    };
  }, []);

  return {
    isConnected,
    error,
  };
};
