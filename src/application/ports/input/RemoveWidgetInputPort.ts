import { type Result } from "@shared/utils/result";

/**
 * Input Port - Remove Widget Use Case
 */
export interface RemoveWidgetInputPort {
  execute(widgetId: string): Promise<Result<void, Error>>;
}
