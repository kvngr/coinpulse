import { type ContractAddress } from "@domain/value-objects/ContractAddress";
import { Money } from "@domain/value-objects/Money";

export type TradeType = "BUY" | "SELL";

/**
 * Trade Entity
 * Represents a single trade transaction
 */
export class Trade {
  private constructor(
    private readonly _id: string,
    private readonly _contractAddress: ContractAddress,
    private readonly _walletAddress: string,
    private readonly _amount: Money,
    private readonly _type: TradeType,
    private readonly _timestamp: Date,
    private readonly _transactionHash: string,
  ) {}

  static create(
    id: string,
    contractAddress: ContractAddress,
    walletAddress: string,
    amount: number,
    currency: string,
    type: TradeType,
    timestamp: Date,
    transactionHash: string,
  ): Trade {
    if (id.length === 0) {
      throw new Error("Trade ID is required");
    }

    if (id.trim().length === 0) {
      throw new Error("Trade ID cannot be empty or whitespace");
    }

    if (walletAddress.length === 0) {
      throw new Error("Wallet address is required");
    }

    if (walletAddress.trim().length === 0) {
      throw new Error("Wallet address cannot be empty or whitespace");
    }

    if (transactionHash.length === 0) {
      throw new Error("Transaction hash is required");
    }

    if (transactionHash.trim().length === 0) {
      throw new Error("Transaction hash cannot be empty or whitespace");
    }

    return new Trade(
      id,
      contractAddress,
      walletAddress,
      Money.create(amount, currency),
      type,
      timestamp,
      transactionHash,
    );
  }

  get id(): string {
    return this._id;
  }

  get contractAddress(): ContractAddress {
    return this._contractAddress;
  }

  get walletAddress(): string {
    return this._walletAddress;
  }

  get amount(): Money {
    return this._amount;
  }

  get type(): TradeType {
    return this._type;
  }

  get timestamp(): Date {
    return this._timestamp;
  }

  get transactionHash(): string {
    return this._transactionHash;
  }

  isBuy(): boolean {
    return this._type === "BUY";
  }

  isSell(): boolean {
    return this._type === "SELL";
  }

  getAge(): number {
    return Date.now() - this._timestamp.getTime();
  }

  toJSON() {
    return {
      id: this._id,
      contractAddress: this._contractAddress.toJSON(),
      walletAddress: this._walletAddress,
      amount: this._amount.toJSON(),
      type: this._type,
      timestamp: this._timestamp.toISOString(),
      transactionHash: this._transactionHash,
    };
  }
}
