import { type Widget, type WidgetType } from "@domain/entities/Widget";
import { type Result } from "@shared/utils/result";

export interface AddWidgetCommand {
  type: WidgetType;
  contractAddress: string;
  position?: { x: number; y: number };
}

/**
 * Input Port - Add Widget Use Case
 */
export interface AddWidgetInputPort {
  execute(command: AddWidgetCommand): Promise<Result<Widget, Error>>;
}
