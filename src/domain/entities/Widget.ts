import { type ContractAddress } from "@domain/value-objects/ContractAddress";
import { type Position } from "@domain/value-objects/Position";

export type WidgetType = "LIVE_PRICE" | "TRADE_FEED";

export interface WidgetConfig {
  refreshInterval?: number;
  [key: string]: unknown;
}

/**
 * Widget Entity
 * Represents a dashboard widget that displays crypto data
 */
export class Widget {
  private constructor(
    private readonly _id: string,
    private readonly _type: WidgetType,
    private readonly _contractAddress: ContractAddress,
    private _position: Position,
    private _config: WidgetConfig = {},
  ) {}

  static create(
    id: string,
    type: WidgetType,
    contractAddress: ContractAddress,
    position: Position,
    config?: WidgetConfig,
  ): Widget {
    if (id.length === 0) {
      throw new Error("Widget ID is required");
    }

    if (id.trim().length === 0) {
      throw new Error("Widget ID cannot be empty or whitespace");
    }

    return new Widget(id, type, contractAddress, position, config ?? {});
  }

  get id(): string {
    return this._id;
  }

  get type(): WidgetType {
    return this._type;
  }

  get contractAddress(): ContractAddress {
    return this._contractAddress;
  }

  get position(): Position {
    return this._position;
  }

  get config(): WidgetConfig {
    return { ...this._config };
  }

  moveTo(newPosition: Position): void {
    this._position = newPosition;
  }

  updateConfig(config: Partial<WidgetConfig>): void {
    this._config = { ...this._config, ...config };
  }

  toJSON() {
    return {
      id: this._id,
      type: this._type,
      contractAddress: this._contractAddress.toJSON(),
      position: this._position.toJSON(),
      config: this._config,
    };
  }
}
