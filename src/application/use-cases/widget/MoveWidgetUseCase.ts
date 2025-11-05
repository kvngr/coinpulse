import {
  type MoveWidgetInputPort,
  type MoveWidgetCommand,
} from "@application/ports/input/MoveWidgetInputPort";
import { type WidgetStoreOutputPort } from "@application/ports/output/WidgetStoreOutputPort";
import { type Widget } from "@domain/entities/Widget";
import { Position } from "@domain/value-objects/Position";
import { type Result, ok, err } from "@shared/utils/result";
import { moveWidgetInputSchema } from "@shared/validation/schemas";

/**
 * Move Widget Use Case Implementation
 */
export class MoveWidgetUseCase implements MoveWidgetInputPort {
  constructor(private readonly widgetStore: WidgetStoreOutputPort) {}

  async execute(command: MoveWidgetCommand): Promise<Result<Widget, Error>> {
    try {
      // Validate input
      const validated = moveWidgetInputSchema.parse(command);

      // Get existing widget
      const widget = this.widgetStore.getById(validated.widgetId);

      if (widget === null) {
        return err(new Error(`Widget with ID ${validated.widgetId} not found`));
      }

      // Create new position
      const newPosition = Position.create(
        validated.position.x,
        validated.position.y,
      );

      // Update widget position
      widget.moveTo(newPosition);

      // Persist changes
      this.widgetStore.update(widget);

      return ok(widget);
    } catch (error) {
      return err(
        error instanceof Error ? error : new Error("Failed to move widget"),
        error instanceof Error ? error.message : undefined,
      );
    }
  }
}
