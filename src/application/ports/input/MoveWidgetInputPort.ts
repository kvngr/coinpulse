import { type Widget } from "@domain/entities/Widget";
import { type Result } from "@shared/utils/result";

export interface MoveWidgetCommand {
  widgetId: string;
  position: { x: number; y: number };
}

/**
 * Input Port - Move Widget Use Case
 */
export interface MoveWidgetInputPort {
  execute(command: MoveWidgetCommand): Promise<Result<Widget, Error>>;
}
