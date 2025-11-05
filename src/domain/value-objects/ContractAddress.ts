/**
 * ContractAddress Value Object
 * Represents a validated blockchain contract address
 */
export class ContractAddress {
  private constructor(private readonly _value: string) {}

  static create(address: string): ContractAddress {
    const trimmed = address.trim();

    if (trimmed.length === 0) {
      throw new Error("Contract address cannot be empty");
    }

    // Basic validation - can be enhanced with chain-specific validation
    if (trimmed.length < 32) {
      throw new Error("Invalid contract address format");
    }

    return new ContractAddress(trimmed);
  }

  get value(): string {
    return this._value;
  }

  equals(other: ContractAddress): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  toJSON(): string {
    return this._value;
  }
}
