/**
 * Percentage Value Object
 * Represents a percentage value
 */
export class Percentage {
  private constructor(private readonly _value: number) {}

  static create(value: number): Percentage {
    if (Number.isFinite(value) === false) {
      throw new Error("Percentage must be a finite number");
    }
    return new Percentage(value);
  }

  get value(): number {
    return this._value;
  }

  isPositive(): boolean {
    return this._value > 0;
  }

  isNegative(): boolean {
    return this._value < 0;
  }

  format(decimals: number = 2): string {
    const sign = this._value >= 0 ? "+" : "";
    return `${sign}${this._value.toFixed(decimals)}%`;
  }

  toJSON(): number {
    return this._value;
  }
}
