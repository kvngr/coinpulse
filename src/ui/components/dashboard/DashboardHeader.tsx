import React from "react";

import { cn } from "@shared/utils/cn";
import { Button } from "@ui/components/common/Button";
import { useWebSocket } from "@ui/hooks/useWebSocket";

import { AddWidgetDialog } from "./AddWidgetDialog";

export const DashboardHeader: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const { isConnected } = useWebSocket();

  return (
    <React.Fragment>
      <header className="shrink-0">
        <div className="flex flex-col items-center max-lg:gap-5 max-lg:text-center lg:flex-row">
          <div className="flex flex-1 flex-col justify-center">
            <h1 className="mb-2 text-4xl font-bold text-white">📟 CoinPulse</h1>
            <p className="text-gray-400">
              Real-time crypto price and trade tracker
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <div className="flex h-8 items-center justify-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-3 py-2">
              <div
                className={cn(
                  "size-2 rounded-full",
                  isConnected === true
                    ? "animate-pulse bg-green-500"
                    : "bg-red-500",
                )}
              />
              <span className="text-sm font-medium text-gray-400">
                {isConnected === true ? "Connected" : "Disconnected"}
              </span>
            </div>

            <Button
              onClick={() => {
                setIsAddDialogOpen(true);
              }}
            >
              + Add Widget
            </Button>
          </div>
        </div>
      </header>

      <AddWidgetDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
        }}
      />
    </React.Fragment>
  );
};
