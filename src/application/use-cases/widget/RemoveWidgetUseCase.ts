import { type RemoveWidgetInputPort } from "@application/ports/input/RemoveWidgetInputPort";
import { type WidgetStoreOutputPort } from "@application/ports/output/WidgetStoreOutputPort";
import { type Result, ok, err } from "@shared/utils/result";

/**
 * Remove Widget Use Case Implementation
 */
export class RemoveWidgetUseCase implements RemoveWidgetInputPort {
  constructor(private readonly widgetStore: WidgetStoreOutputPort) {}

  async execute(widgetId: string): Promise<Result<void, Error>> {
    if (widgetId.length === 0) {
      return err(new Error("Widget ID is required"));
    }

    if (widgetId.trim().length === 0) {
      return err(new Error("Widget ID cannot be empty or whitespace"));
    }

    const widget = this.widgetStore.getById(widgetId);

    if (widget === null) {
      return err(new Error(`Widget with ID ${widgetId} not found`));
    }

    this.widgetStore.remove(widgetId);
    return ok(undefined);
  }
}
