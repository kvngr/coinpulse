import React, { useCallback } from "react";

import { LivePriceWidget } from "@ui/components/widgets/LivePriceWidget";
import { TradeFeedWidget } from "@ui/components/widgets/TradeFeedWidget";
import { useWidgets } from "@ui/hooks/useWidgets";

export const DashboardGrid: React.FC = () => {
  const { widgets, removeWidget } = useWidgets();

  const handleRemove = useCallback(
    async (widgetId: string) => {
      const result = await removeWidget(widgetId);
      if (result.outcome === "failed") {
        console.error("Failed to remove widget:", result.error);
      }
    },
    [removeWidget],
  );

  if (widgets.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-400">
            No widgets yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a widget to track your favorite tokens
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {widgets.map((widget) => {
        if (widget.type === "LIVE_PRICE") {
          return (
            <LivePriceWidget
              key={widget.id}
              contractAddress={widget.contractAddress.value}
              onRemove={() => handleRemove(widget.id)}
            />
          );
        }
        if (widget.type === "TRADE_FEED") {
          return (
            <TradeFeedWidget
              key={widget.id}
              contractAddress={widget.contractAddress.value}
              onRemove={() => handleRemove(widget.id)}
            />
          );
        }
        return null;
      })}
    </div>
  );
};
