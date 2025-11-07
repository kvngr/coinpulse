import React from "react";

import { AnimatePresence, motion } from "motion/react";

import { formatNumber } from "@shared/utils/number";
import { truncateAddress } from "@shared/utils/string";
import { formatRelativeTimeShort } from "@shared/utils/time";
import { Badge } from "@ui/components/common/Badge";
import { Card } from "@ui/components/common/Card";
import { Spinner } from "@ui/components/common/Spinner";
import { useTokenMetadata } from "@ui/hooks/useTokenMetadata";
import { useTradeData } from "@ui/hooks/useTradeData";

type TradeFeedWidgetProps = {
  contractAddress: string;
  onRemove?: () => void;
};

export const TradeFeedWidget = React.memo<TradeFeedWidgetProps>(
  ({ contractAddress, onRemove }) => {
    const { metadata } = useTokenMetadata(contractAddress);
    const { trades, isLoading, error } = useTradeData(contractAddress);

    if (isLoading === true) {
      return (
        <Card className="flex min-h-0 items-center justify-center p-6">
          <Spinner size="lg" />
        </Card>
      );
    }

    if (error !== null) {
      return (
        <Card className="flex min-h-0 flex-col items-center justify-center p-6">
          <p className="mb-2 text-red-400">{error.message}</p>
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

    return (
      <Card className="relative min-h-0">
        <h3 className="absolute top-2 left-6 text-sm font-medium text-gray-400">
          Trade Feed
        </h3>
        {onRemove !== undefined ? (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 cursor-pointer text-gray-500 transition-colors duration-300 ease-in-out hover:text-white"
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

        <div className="mt-4 flex h-fit max-h-96 min-w-96 flex-col overflow-hidden p-6">
          <div className="flex flex-row items-center gap-2">
            {metadata.logo !== undefined ? (
              <img
                src={metadata.logo}
                alt={metadata.symbol}
                className="size-6 self-end rounded-md"
              />
            ) : null}
            <Badge size="sm" variant="purple">
              {metadata.symbol}
            </Badge>
            <span className="mt-1 text-xs text-gray-500">
              {truncateAddress(contractAddress)}
            </span>
          </div>

          <div className="relative mt-4 flex-1 overflow-auto">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">Loading trades...</p>
              </div>
            ) : error !== null ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-xs text-red-500">Failed to load trades</p>
              </div>
            ) : trades.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No trades yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {trades.map((trade) => {
                    return (
                      <motion.div
                        key={trade.id}
                        layoutId={trade.id}
                        transition={{
                          duration: 0.2,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        className="flex items-center justify-between rounded-lg bg-gray-800/50 p-3 transition-colors hover:bg-gray-800"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-white">
                            {truncateAddress(trade.walletAddress)}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {formatNumber(trade.amount.amount, 2)}{" "}
                            {trade.amount.currency}
                          </p>
                        </div>

                        <div className="mx-3">
                          <Badge variant={trade.isBuy() ? "success" : "danger"}>
                            {trade.type}
                          </Badge>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {formatRelativeTimeShort(trade.timestamp)}
                          </p>
                          <a
                            href={`https://solscan.io/tx/${trade.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0.5 flex items-center justify-end gap-1 text-xs text-blue-400 hover:text-blue-300"
                          >
                            <span>View</span>
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-800 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-xs text-gray-500">Live</span>
            </div>
            <span className="text-xs text-gray-500">
              {trades.length} trade{trades.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="absolute bottom-[72px] left-0 h-5 w-full bg-linear-to-b from-transparent to-gray-900" />
        </div>
      </Card>
    );
  },
);
