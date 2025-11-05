import { type ContractAddress } from "@domain/value-objects/ContractAddress";
import { Money } from "@domain/value-objects/Money";
import { Percentage } from "@domain/value-objects/Percentage";

/**
 * Price Entity
 * Represents the current market price data for a cryptocurrency token
 */
export class Price {
  private constructor(
    private readonly _contractAddress: ContractAddress,
    private readonly _priceUSD: Money,
    private readonly _priceSOL: Money,
    private readonly _variation24h: Percentage,
    private readonly _lastUpdate: Date,
  ) {}

  static create(
    contractAddress: ContractAddress,
    priceUSD: number,
    priceSOL: number,
    variation24h: number,
    lastUpdate?: Date,
  ): Price {
    return new Price(
      contractAddress,
      Money.USD(priceUSD),
      Money.SOL(priceSOL),
      Percentage.create(variation24h),
      lastUpdate ?? new Date(),
    );
  }

  get contractAddress(): ContractAddress {
    return this._contractAddress;
  }

  get priceUSD(): Money {
    return this._priceUSD;
  }

  get priceSOL(): Money {
    return this._priceSOL;
  }

  get variation24h(): Percentage {
    return this._variation24h;
  }

  get lastUpdate(): Date {
    return this._lastUpdate;
  }

  isStale(maxAgeMs: number = 60000): boolean {
    return Date.now() - this._lastUpdate.getTime() > maxAgeMs;
  }

  toJSON() {
    return {
      contractAddress: this._contractAddress.toJSON(),
      priceUSD: this._priceUSD.toJSON(),
      priceSOL: this._priceSOL.toJSON(),
      variation24h: this._variation24h.toJSON(),
      lastUpdate: this._lastUpdate.toISOString(),
    };
  }
}
