import { type Widget } from "@domain/entities/Widget";
import { type Result } from "@shared/utils/result";

export interface MoveWidgetCommand {
  widgetId: string;
  position: { x: number; y: number };
}

/**
 * Move Widget Input Port
 * Updates a widget's position after drag & drop
 */
export interface MoveWidgetInputPort {
  execute(command: MoveWidgetCommand): Promise<Result<Widget, Error>>;
}
