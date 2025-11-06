import React from "react";

import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@shared/utils/cn";
import { truncateAddress } from "@shared/utils/string";
import { Badge } from "@ui/components/common/Badge";
import { Card } from "@ui/components/common/Card";
import { Spinner } from "@ui/components/common/Spinner";
import { usePriceData } from "@ui/hooks/usePriceData";
import { usePriceDirection } from "@ui/hooks/usePriceDirection";
import { useTokenMetadata } from "@ui/hooks/useTokenMetadata";

type LivePriceWidgetProps = {
  contractAddress: string;
  onRemove?: () => void;
};

export const LivePriceWidget = React.memo<LivePriceWidgetProps>(
  ({ contractAddress, onRemove }) => {
    const { metadata } = useTokenMetadata(contractAddress);
    const { price, isLoading, error } = usePriceData(contractAddress);

    const priceDirection = usePriceDirection(price, contractAddress);

    if (isLoading === true) {
      return (
        <Card className="flex min-h-0 items-center justify-center p-6">
          <Spinner size="lg" />
        </Card>
      );
    }

    if (error !== null || price === undefined) {
      return (
        <Card className="flex min-h-0 flex-col items-center justify-center p-6">
          <p className="mb-2 text-red-400">{error?.message}</p>
          {onRemove !== undefined ? (
            <button
              onClick={onRemove}
              className="text-sm text-gray-400 hover:text-white"
            >
              Remove widget
            </button>
          ) : null}
        </Card>
      );
    }

    const variation = price.variation24h;
    const isPositive = variation.isPositive();

    return (
      <Card className="relative min-h-0">
        {onRemove !== undefined ? (
          <button
            onClick={onRemove}
            className="absolute top-4 right-4 cursor-pointer text-gray-500 transition-colors duration-300 ease-in-out hover:text-white"
            aria-label="Remove widget"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : null}

        <div className="flex h-fit flex-col p-6">
          <div className="mb-4">
            <h3 className="flex flex-row items-baseline gap-2">
              <span className="text-sm font-medium text-gray-400">
                Live Price
              </span>
              <span className="mt-1 text-xs text-gray-500">
                {truncateAddress(contractAddress)}
              </span>
              <Badge size="sm" variant="purple">
                {metadata.symbol}
              </Badge>
              {metadata.logo !== undefined ? (
                <img
                  src={metadata.logo}
                  alt={metadata.symbol}
                  className="size-6 self-end rounded-full"
                />
              ) : null}
            </h3>
          </div>

          <div className="flex flex-1 flex-col justify-center">
            <div className="mb-4">
              <NumberFlowGroup>
                <p className="flex flex-row items-center gap-2 font-mono text-4xl font-bold text-white">
                  <NumberFlow
                    value={price.priceUSD.amount}
                    locales="en-US"
                    format={{
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 6,
                    }}
                    className={cn(
                      "transition-colors duration-300 ease-in-out",
                      priceDirection === "down" ? "text-red-500" : undefined,
                      priceDirection === "up" ? "text-emerald-500" : undefined,
                      priceDirection === "flat" ? "text-white" : undefined,
                    )}
                  />
                  <AnimatePresence>
                    {priceDirection === "down" ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <TrendingDown className="size-4 text-red-500" />
                      </motion.div>
                    ) : null}
                    {priceDirection === "up" ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <TrendingUp className="size-4 text-emerald-500" />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  <NumberFlow
                    value={price.priceSOL.amount}
                    locales="en-US"
                    format={{
                      style: "decimal",
                      minimumFractionDigits: 12,
                    }}
                  />{" "}
                  SOL
                </p>
              </NumberFlowGroup>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={isPositive ? "success" : "danger"}>
                <NumberFlow
                  value={variation.value / 100}
                  locales="en-US"
                  format={{
                    style: "percent",
                    minimumFractionDigits: 2,
                    signDisplay: "always",
                  }}
                />
              </Badge>
              <span className="text-xs text-gray-500">24h change</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-xs text-gray-500">Live</span>
          </div>
        </div>
      </Card>
    );
  },
);
