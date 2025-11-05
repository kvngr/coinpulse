import axios, { type AxiosInstance, type AxiosError } from "axios";

import {
  API_BASE_URL,
  NATIVE_SOL_TOKEN_ADDRESS,
  VALIDATION,
} from "@shared/constants";

/**
 * API Configuration
 * Configures axios instance for Mobula API integration
 */

// Environment variables (can be set in .env file)
const MOBULA_API_KEY = import.meta.env.VITE_MOBULA_API_KEY;

/**
 * Create configured axios instance
 */
export const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      ...(MOBULA_API_KEY && { Authorization: MOBULA_API_KEY }),
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Log requests in development
      if (import.meta.env.DEV) {
        console.info(
          `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        );
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      // Log responses in development
      if (import.meta.env.DEV) {
        console.info(`[API Response] ${response.config.url}`, response.data);
      }
      return response;
    },
    (error: AxiosError) => {
      // Handle errors
      const message = getErrorMessage(error);

      if (import.meta.env.DEV) {
        console.error(`[API Error] ${error.config?.url}`, message);
      }

      return Promise.reject(new Error(message));
    },
  );

  return client;
};

/**
 * Extract meaningful error message from AxiosError
 */
function getErrorMessage(error: AxiosError): string {
  if (error.response) {
    // Server responded with error status
    const data = error.response.data as { message?: string; error?: string };
    const status = error.response.status;

    if (status === 404) {
      return `Token not found. Please use a valid Solana token address (e.g., ${NATIVE_SOL_TOKEN_ADDRESS} for SOL)`;
    }

    if (status === 401 || status === 403) {
      return "API authentication failed. Please check your VITE_MOBULA_API_KEY in .env file";
    }

    if (status === 429) {
      return "Rate limit exceeded. Please try again later";
    }

    return (
      data?.message || data?.error || `Server error: ${error.response.status}`
    );
  } else if (error.request) {
    // Request was made but no response
    return "No response from server. Please check your connection.";
  } else {
    // Error in request setup
    return error.message || "An unexpected error occurred";
  }
}

/**
 * Default API client instance
 */
export const apiClient = createApiClient();

/**
 * API Configuration object
 */
export const apiConfig = {
  baseURL: API_BASE_URL,
  apiKey: MOBULA_API_KEY,
  timeout: 10000,
  maxRetries: VALIDATION.MAX_RETRIES,
  retryDelay: VALIDATION.RETRY_DELAY,
} as const;

/**
 * Check if API is properly configured
 */
export function isApiConfigured(): boolean {
  return MOBULA_API_KEY.length > 0;
}

/**
 * Get API key (for debugging purposes)
 */
export function getApiKeyStatus(): string {
  if (MOBULA_API_KEY.length === 0) {
    return "Not configured";
  }
  return `Configured (${MOBULA_API_KEY.substring(0, 8)}...)`;
}
