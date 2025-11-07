import {
  type MoveWidgetInputPort,
  type MoveWidgetCommand,
} from "@application/ports/input/MoveWidgetInputPort";
import { type WidgetStoreOutputPort } from "@application/ports/output/WidgetStoreOutputPort";
import { type Widget } from "@domain/entities/Widget";
import { Position } from "@domain/value-objects/Position";
import { type Result, ok, err } from "@shared/utils/result";

/**
 * Move Widget Use Case Implementation
 * Updates widget position after drag & drop
 */
export class MoveWidgetUseCase implements MoveWidgetInputPort {
  constructor(private readonly widgetStore: WidgetStoreOutputPort) {}

  async execute(command: MoveWidgetCommand): Promise<Result<Widget, Error>> {
    try {
      // Validate widget exists
      const widget = this.widgetStore.getById(command.widgetId);

      if (widget === null) {
        return err(new Error(`Widget with ID ${command.widgetId} not found`));
      }

      // Create new position
      const newPosition = Position.create(
        command.position.x,
        command.position.y,
      );

      // Update widget position
      widget.moveTo(newPosition);

      // Persist changes
      this.widgetStore.update(widget);

      return ok(widget);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to move widget";
      return err(
        error instanceof Error ? error : new Error(errorMessage),
        errorMessage,
      );
    }
  }
}
