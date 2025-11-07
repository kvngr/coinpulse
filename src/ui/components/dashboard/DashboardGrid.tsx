import React from "react";

import { DraggableElement } from "@ui/components/common/DraggableElement";
import { LivePriceWidget } from "@ui/components/widgets/LivePriceWidget";
import { TradeFeedWidget } from "@ui/components/widgets/TradeFeedWidget";
import { useWidgets } from "@ui/hooks/useWidgets";

export const DashboardGrid: React.FC = () => {
  const { widgets, removeWidget, moveWidget } = useWidgets();
  const gridRef = React.useRef<HTMLDivElement>(null);

  const handleRemove = async (widgetId: string) => {
    const result = await removeWidget(widgetId);
    if (result.outcome === "failed") {
      console.error("Failed to remove widget:", result.error);
    }
  };

  const handleDragEnd = async (widgetId: string, x: number, y: number) => {
    const result = await moveWidget({
      widgetId,
      position: { x, y },
    });
    if (result.outcome === "failed") {
      console.error("Failed to move widget:", result.error);
    }
  };

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
    <div
      ref={gridRef}
      className="relative h-full min-h-screen flex-1"
      style={{ minWidth: "100%" }}
    >
      {widgets.map((widget) => {
        const { x, y } = widget.position;

        if (widget.type === "LIVE_PRICE") {
          return (
            <DraggableElement
              dragConstraints={gridRef}
              onDragEnd={(newX, newY) => handleDragEnd(widget.id, newX, newY)}
              key={widget.id}
              x={x}
              y={y}
            >
              <LivePriceWidget
                contractAddress={widget.contractAddress.value}
                onRemove={() => handleRemove(widget.id)}
              />
            </DraggableElement>
          );
        }
        if (widget.type === "TRADE_FEED") {
          return (
            <DraggableElement
              dragConstraints={gridRef}
              onDragEnd={(newX, newY) => handleDragEnd(widget.id, newX, newY)}
              key={widget.id}
              x={x}
              y={y}
            >
              <TradeFeedWidget
                contractAddress={widget.contractAddress.value}
                onRemove={() => handleRemove(widget.id)}
              />
            </DraggableElement>
          );
        }
        return null;
      })}
    </div>
  );
};
