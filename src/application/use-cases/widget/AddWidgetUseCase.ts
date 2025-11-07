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
import { formatZodError } from "@shared/utils/zod";
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
        : Position.create(0, 0); // Default position

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
      // Format Zod validation errors for user-friendly display
      const errorMessage = formatZodError(error);
      return err(
        error instanceof Error ? error : new Error(errorMessage),
        errorMessage,
      );
    }
  }
}
