import React from "react";

import { type WidgetType } from "@domain/entities/Widget";
import { Button } from "@ui/components/common/Button";
import { Input } from "@ui/components/common/Input";
import { Modal } from "@ui/components/common/Modal";
import { useWidgets } from "@ui/hooks/useWidgets";

type AddWidgetDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [widgetType, setWidgetType] = React.useState<WidgetType>("LIVE_PRICE");
  const [contractAddress, setContractAddress] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const { addWidget } = useWidgets();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (contractAddress.trim().length === 0) {
      setError("Contract address is required");
      return;
    }

    setIsLoading(true);

    const result = await addWidget({
      type: widgetType,
      contractAddress: contractAddress.trim(),
    });

    if (result.outcome === "success") {
      setContractAddress("");
      setWidgetType("LIVE_PRICE");
      onClose();
    } else {
      setError(result.cause ?? result.error.message);
    }

    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="h-fit max-w-md">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add Widget</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Widget Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => setWidgetType("LIVE_PRICE")}
                className={`rounded-lg border-2 p-4 transition-all ${
                  widgetType === "LIVE_PRICE"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                }`}
              >
                <div className="mb-2 text-2xl">💰</div>
                <div className="text-sm font-medium text-white">Live Price</div>
                <div className="mt-1 text-xs text-gray-400">
                  Track price updates
                </div>
              </Button>

              <Button
                type="button"
                onClick={() => setWidgetType("TRADE_FEED")}
                className={`rounded-lg border-2 p-4 transition-all ${
                  widgetType === "TRADE_FEED"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                }`}
              >
                <div className="mb-2 text-2xl">📊</div>
                <div className="text-sm font-medium text-white">Trade Feed</div>
                <div className="mt-1 text-xs text-gray-400">
                  Latest 20 trades
                </div>
              </Button>
            </div>
          </div>

          <Input
            label="Contract Address"
            value={contractAddress}
            onChange={(event) => setContractAddress(event.target.value)}
            placeholder="Enter token contract address"
            error={error}
            disabled={isLoading}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Widget"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
