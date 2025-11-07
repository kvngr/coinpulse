/**
 * Position Value Object
 * Represents a 2D position for widget placement (x, y in pixels or grid units)
 */
export class Position {
  private constructor(
    private readonly _x: number,
    private readonly _y: number,
  ) {}

  static create(x: number, y: number): Position {
    if (Number.isFinite(x) === false || Number.isFinite(y) === false) {
      throw new Error("Position coordinates must be finite numbers");
    }
    return new Position(x, y);
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  equals(other: Position): boolean {
    return this._x === other._x && this._y === other._y;
  }

  toJSON() {
    return { x: this._x, y: this._y };
  }
}
