import {
  type AddWidgetInputPort,
  type AddWidgetCommand,
} from "@application/ports/input/AddWidgetInputPort";
import { type WidgetStoreOutputPort } from "@application/ports/output/WidgetStoreOutputPort";
import { Widget } from "@domain/entities/Widget";
import { ContractAddress } from "@domain/value-objects/ContractAddress";
import { Position } from "@domain/value-objects/Position";
import { generateId } from "@shared/utils/id";
import { type Result, ok, err } from "@shared/utils/result";
import { addWidgetInputSchema } from "@shared/validation/schemas";

/**
 * Add Widget Use Case Implementation
 */
export class AddWidgetUseCase implements AddWidgetInputPort {
  constructor(private readonly widgetStore: WidgetStoreOutputPort) {}

  async execute(command: AddWidgetCommand): Promise<Result<Widget, Error>> {
    try {
      // Validate input
      const validated = addWidgetInputSchema.parse(command);

      // Create value objects
      const contractAddress = ContractAddress.create(validated.contractAddress);
      const position = validated.position
        ? Position.create(validated.position.x, validated.position.y)
        : this.findAvailablePosition();

      // Create widget entity
      const widget = Widget.create(
        generateId(),
        validated.type,
        contractAddress,
        position,
      );

      // Persist widget
      this.widgetStore.add(widget);

      return ok(widget);
    } catch (error) {
      return err(
        error instanceof Error ? error : new Error("Failed to add widget"),
        error instanceof Error ? error.message : undefined,
      );
    }
  }

  /**
   * Find the next available position in the grid
   */
  private findAvailablePosition(): Position {
    const existingWidgets = this.widgetStore.getAll();
    const positions = existingWidgets.map((widget) => widget.position);

    // Simple algorithm: place in first empty slot
    let x = 0;
    let y = 0;

    while (positions.some((position) => position.x === x && position.y === y)) {
      x += 1;
      if (x >= 12) {
        // Move to next row after 12 columns
        x = 0;
        y += 1;
      }
    }

    return Position.create(x, y);
  }
}
