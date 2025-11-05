/**
 * Money Value Object
 * Represents a monetary value with currency
 */
export class Money {
  private constructor(
    private readonly _amount: number,
    private readonly _currency: string,
  ) {}

  static create(amount: number, currency: string): Money {
    if (Number.isFinite(amount) === false) {
      throw new Error("Amount must be a finite number");
    }

    if (currency.length === 0) {
      throw new Error("Currency must be specified");
    }

    if (currency.trim().length === 0) {
      throw new Error("Currency cannot be empty or whitespace");
    }

    return new Money(amount, currency.toUpperCase());
  }

  static USD(amount: number): Money {
    return Money.create(amount, "USD");
  }

  static SOL(amount: number): Money {
    return Money.create(amount, "SOL");
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  format(decimals: number = 2): string {
    return `${this._amount.toFixed(decimals)} ${this._currency}`;
  }

  toJSON() {
    return {
      amount: this._amount,
      currency: this._currency,
    };
  }
}
