import React from "react";

import { type Price } from "@domain/entities/Price";

const FLASH_DURATION_MS = 300;

/**
 * Hook to track price direction (up/down/flat)
 *
 * Separates concerns:
 * - Domain (Price): Has compareWith() logic
 * - Hook (UI): Tracks previous price value (not object reference)
 * - Component: Uses the hook for display
 *
 * Performance: Compares numeric values instead of object references
 * to prevent infinite re-renders
 */
export const usePriceDirection = (
  price: Price | undefined,
  contractAddress: string,
) => {
  const [direction, setDirection] = React.useState<"up" | "down" | "flat">(
    "flat",
  );
  const prevPriceValueRef = React.useRef<number | undefined>(undefined);
  const flashTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Reset when contract address changes
  React.useEffect(() => {
    prevPriceValueRef.current = undefined;
    setDirection("flat");

    if (flashTimerRef.current !== null) {
      clearTimeout(flashTimerRef.current);
      flashTimerRef.current = null;
    }
  }, [contractAddress]);

  // Extract the actual price value (not the object reference)
  const currentPriceValue = price?.priceUSD.amount;

  // Calculate direction when price value changes
  React.useEffect(() => {
    if (currentPriceValue === undefined) {
      return;
    }

    const prevValue = prevPriceValueRef.current;

    if (prevValue !== undefined) {
      // Direct comparison of numeric values
      // (Price.compareWithValue() is available for other use cases)
      let newDirection: "up" | "down" | "flat" = "flat";

      if (currentPriceValue > prevValue) {
        newDirection = "up";
      } else if (currentPriceValue < prevValue) {
        newDirection = "down";
      }

      // Only update if direction actually changed (prevents unnecessary re-renders)
      setDirection((current) => {
        if (current === newDirection) {
          return current;
        }
        return newDirection;
      });

      if (flashTimerRef.current !== null) {
        clearTimeout(flashTimerRef.current);
        flashTimerRef.current = null;
      }

      flashTimerRef.current = setTimeout(() => {
        setDirection("flat");
      }, FLASH_DURATION_MS);
    }

    // Update previous value
    prevPriceValueRef.current = currentPriceValue;
  }, [currentPriceValue]);

  return direction;
};
