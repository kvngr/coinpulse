import { z } from "zod";

import { VALIDATION } from "@shared/constants";

/**
 * Zod Validation Schemas
 */

// Contract Address Schema
export const contractAddressSchema = z
  .string()
  .trim()
  .min(
    VALIDATION.MIN_CONTRACT_ADDRESS_LENGTH,
    "Contract address must be at least 32 characters",
  );

// Grid Position Schema
export const gridPositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

// Widget Type Schema
export const widgetTypeSchema = z.enum(["LIVE_PRICE", "TRADE_FEED"]);

// Widget Config Schema
export const widgetConfigSchema = z
  .object({
    refreshInterval: z.number().positive().optional(),
  })
  .catchall(z.unknown());

// Widget Schema
export const widgetSchema = z.object({
  id: z.string().min(1),
  type: widgetTypeSchema,
  contractAddress: contractAddressSchema,
  position: gridPositionSchema,
  config: widgetConfigSchema.optional(),
});

// Price Data Schema
export const priceDataSchema = z.object({
  contractAddress: contractAddressSchema,
  priceUSD: z.number().nonnegative(),
  priceSOL: z.number().nonnegative(),
  variation24h: z.number(),
  timestamp: z.string().optional(),
});

// Trade Type Schema
export const tradeTypeSchema = z.enum(["BUY", "SELL"]);

// Trade Data Schema
export const tradeDataSchema = z.object({
  id: z.string().min(1),
  contractAddress: contractAddressSchema,
  walletAddress: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().min(1),
  type: tradeTypeSchema,
  timestamp: z.string(),
  transactionHash: z.string().min(1),
});

// API Response Schema
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    success: z.boolean(),
    error: z.string().optional(),
  });

// WebSocket Message Schema
export const wsMessageSchema = <T extends z.ZodTypeAny>(payloadSchema: T) =>
  z.object({
    type: z.string(),
    payload: payloadSchema,
    timestamp: z.number(),
  });

// Query Parameters Schema (for URL state)
export const queryParamsSchema = z.object({
  widgets: z.string().optional(), // JSON encoded widgets array
});

// Add Widget Input Schema
export const addWidgetInputSchema = z.object({
  type: widgetTypeSchema,
  contractAddress: contractAddressSchema,
  position: gridPositionSchema.optional(),
});

// Validation helper type inference
export type ContractAddressInput = z.infer<typeof contractAddressSchema>;
export type GridPositionInput = z.infer<typeof gridPositionSchema>;
export type WidgetTypeInput = z.infer<typeof widgetTypeSchema>;
export type WidgetInput = z.infer<typeof widgetSchema>;
export type PriceDataInput = z.infer<typeof priceDataSchema>;
export type TradeDataInput = z.infer<typeof tradeDataSchema>;
export type AddWidgetInput = z.infer<typeof addWidgetInputSchema>;
