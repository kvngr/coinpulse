import { useEffect, useRef } from "react";

import { useQueryState, parseAsString } from "nuqs";

import { type Widget } from "@domain/entities/Widget";
import {
  parseWidgets,
  serializeWidgets,
  type WidgetUrlItem,
} from "@shared/utils/urlWidgets";

import { useWidgets } from "./useWidgets";

/**
 * Hook to synchronize widget state with URL query parameters
 *
 * - If URL has widgets → Replace store with URL widgets (shared link)
 * - If URL is empty → Sync store to URL (local state)
 */
export const useWidgetUrlSync = () => {
  const { widgets, addWidget, clearWidgets } = useWidgets();
  const [widgetsParam, setWidgetsParam] = useQueryState("w", parseAsString);
  const isInitialLoad = useRef(true);
  const isSyncing = useRef(false);

  // Load widgets from URL on mount (when someone shares a link)
  useEffect(() => {
    if (isInitialLoad.current === false) {
      return;
    }

    isInitialLoad.current = false;

    // If URL has widgets, REPLACE store with URL widgets (shared link)
    if (widgetsParam !== null && widgetsParam.trim().length > 0) {
      const widgetsFromUrl = parseWidgets(widgetsParam);

      if (widgetsFromUrl.length > 0) {
        // Clear existing widgets and add from URL with positions
        isSyncing.current = true;
        clearWidgets(); // ← Clear store before adding

        // Add widgets sequentially to preserve order and position
        (async () => {
          try {
            for (const widget of widgetsFromUrl) {
              await addWidget({
                type: widget.type,
                contractAddress: widget.contractAddress,
                position: { x: widget.x, y: widget.y },
              });
            }
            console.info(
              `[useWidgetUrlSync] ${widgetsFromUrl.length} widgets loaded from URL with positions`,
            );
          } catch (error) {
            console.error("[useWidgetUrlSync] Failed to load widgets:", error);
          } finally {
            isSyncing.current = false;
          }
        })();
      }
    } else {
      // No widgets in URL, sync current widgets to URL
      if (widgets.length > 0) {
        syncWidgetsToUrl(widgets, setWidgetsParam);
      }
    }
  }, [addWidget, clearWidgets, setWidgetsParam, widgets, widgetsParam]);

  useEffect(() => {
    if (isInitialLoad.current || isSyncing.current) {
      return;
    }

    syncWidgetsToUrl(widgets, setWidgetsParam);
  }, [widgets, setWidgetsParam]);

  return {
    widgetsParam,
  };
};

/**
 * Sync widgets to URL
 */
function syncWidgetsToUrl(
  widgets: Widget[],
  setWidgetsParam: (value: string | null) => Promise<URLSearchParams>,
) {
  const widgetItems: WidgetUrlItem[] = widgets.map((widget) => ({
    type: widget.type,
    contractAddress: widget.contractAddress.value,
    x: widget.position.x,
    y: widget.position.y,
  }));

  const serialized = serializeWidgets(widgetItems);

  if (serialized.length > 0) {
    setWidgetsParam(serialized).catch((error) => {
      console.error("[useWidgetUrlSync] Failed to update URL:", error);
    });
  } else {
    // No widgets, clear the param
    setWidgetsParam(null).catch((error) => {
      console.error("[useWidgetUrlSync] Failed to clear URL:", error);
    });
  }
}
