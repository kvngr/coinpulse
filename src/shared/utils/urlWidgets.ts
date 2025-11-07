import { type WidgetType } from "@domain/entities/Widget";

/**
 * Widget URL representation
 * Format: TYPE:ADDRESS:X:Y
 */
export type WidgetUrlItem = {
  type: WidgetType;
  contractAddress: string;
  x: number;
  y: number;
};

/**
 * Serialize widgets to URL format
 * Format: "TYPE:ADDRESS:X:Y,TYPE:ADDRESS:X:Y,..."
 *
 * @example
 * serializeWidgets([
 *   { type: "LIVE_PRICE", contractAddress: "So111...", x: 100, y: 50 },
 *   { type: "TRADE_FEED", contractAddress: "DezXA...", x: 300, y: 150 }
 * ])
 */
export function serializeWidgets(widgets: WidgetUrlItem[]): string {
  if (widgets.length === 0) {
    return "";
  }

  return widgets
    .map(
      (widget) =>
        `${widget.type}:${widget.contractAddress}:${widget.x}:${widget.y}`,
    )
    .join(",");
}

/**
 * Parse widgets from URL format
 * Format: "TYPE:ADDRESS:X:Y,TYPE:ADDRESS:X:Y,..."
 *
 * @example
 * parseWidgets("LIVE_PRICE:So111...:100:50,TRADE_FEED:DezXA...:300:150")
 */
export function parseWidgets(urlString: string | null): WidgetUrlItem[] {
  if (urlString === null || urlString.trim().length === 0) {
    return [];
  }

  const items = urlString.split(",").filter((item) => item.length > 0);

  return items
    .map((item) => {
      const parts = item.split(":");
      const [type, contractAddress, xStr, yStr] = parts;

      // Validate type
      if (type !== "LIVE_PRICE" && type !== "TRADE_FEED") {
        console.warn(`[parseWidgets] Invalid widget type: ${type}`);
        return null;
      }

      // Validate contract address
      if (
        contractAddress === undefined ||
        contractAddress.trim().length === 0
      ) {
        console.warn(
          `[parseWidgets] Missing contract address for type: ${type}`,
        );
        return null;
      }

      // Parse coordinates (default to 0 if missing for backward compatibility)
      const x = xStr !== undefined ? Number.parseInt(xStr, 10) : 0;
      const y = yStr !== undefined ? Number.parseInt(yStr, 10) : 0;

      // Validate coordinates
      if (Number.isFinite(x) === false || Number.isFinite(y) === false) {
        console.warn(
          `[parseWidgets] Invalid coordinates for ${type}:${contractAddress}: x=${xStr}, y=${yStr}`,
        );
        return null;
      }

      return {
        type,
        contractAddress: contractAddress.trim(),
        x,
        y,
      };
    })
    .filter((item): item is WidgetUrlItem => item !== null);
}

/**
 * Validate if a string is a valid widget URL format
 */
export function isValidWidgetUrl(urlString: string): boolean {
  try {
    const parsed = parseWidgets(urlString);
    return parsed.length > 0;
  } catch {
    return false;
  }
}
