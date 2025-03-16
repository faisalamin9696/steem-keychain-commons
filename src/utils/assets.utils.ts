import type { AssetSymbol, PriceType } from '@steempro/dsteem';

export class Asset {
  amount: number;
  symbol: AssetSymbol;
  constructor(amount: number, symbol: AssetSymbol) {
    this.amount = amount;
    this.symbol = symbol;
  }
  /**
   * Create a new Asset instance from a string, e.g. `42.000 STEEM`.
   */
  static fromString = (str: string, expectedSymbol?: AssetSymbol) => {
    const _a = str.split(' ');
    const amountString = _a[0];
    const symbol = _a[1];
    if (!['VESTS', 'TESTS', 'TBD', 'SBD', 'STEEM'].includes(symbol)) {
      throw new Error('Invalid asset symbol: ' + symbol);
    }
    if (expectedSymbol && symbol !== expectedSymbol) {
      throw new Error(
        'Invalid asset, expected symbol: ' + expectedSymbol + ' got: ' + symbol,
      );
    }
    const amount = Number.parseFloat(amountString);
    if (!Number.isFinite(amount)) {
      throw new Error('Invalid asset amount: ' + amountString);
    }
    return new Asset(amount, symbol as AssetSymbol);
  };
  /**
   * Convenience to create new Asset.
   * @param symbol Symbol to use when created from number. Will also be used to validate
   *               the asset, throws if the passed value has a different symbol than this.
   */
  static from = (value: number | Asset | string, symbol?: AssetSymbol) => {
    if (value instanceof Asset) {
      if (symbol && value.symbol !== symbol) {
        throw new Error(
          'Invalid asset, expected symbol: ' + symbol + ' got: ' + value.symbol,
        );
      }
      return value;
    } else if (typeof value === 'number' && Number.isFinite(value)) {
      return new Asset(value, symbol || 'STEEM');
    } else if (typeof value === 'string') {
      return Asset.fromString(value, symbol as AssetSymbol);
    } else {
      throw new Error("Invalid asset '" + String(value) + "'");
    }
  };
  /**
   * Return the smaller of the two assets.
   */
  static min = (a: Asset, b: Asset) => {
    if (a.symbol !== b.symbol)
      throw new Error('can not compare assets with different symbols');

    return a.amount < b.amount ? a : b;
  };
  /**
   * Return the larger of the two assets.
   */
  static max = (a: Asset, b: Asset) => {
    if (a.symbol !== b.symbol)
      throw new Error('can not compare assets with different symbols');

    return a.amount > b.amount ? a : b;
  };
  /**
   * Return asset precision.
   */
  getPrecision = () => {
    switch (this.symbol) {
      case 'TESTS':
      case 'TBD':
      case 'SBD':
      case 'STEEM':
        return 3;
      case 'VESTS':
        return 6;
    }
  };

  /**
   * Return a string representation of this asset, e.g. `42.000 STEEM`.
   */
  toString = () => {
    return this.amount.toFixed(this.getPrecision()) + ' ' + this.symbol;
  };
  /**
   * Return a new Asset instance with amount added.
   */
  add = (amount: number | Asset | string) => {
    const other = Asset.from(amount, this.symbol);
    if (this.symbol !== other.symbol)
      throw new Error('can not add with different symbols');
    return new Asset(this.amount + other.amount, this.symbol);
  };
  /**
   * Return a new Asset instance with amount subtracted.
   */
  subtract = (amount: number | Asset | string) => {
    const other = Asset.from(amount, this.symbol);
    if (this.symbol !== other.symbol)
      throw new Error('can not subtract with different symbols');

    return new Asset(this.amount - other.amount, this.symbol);
  };

  /**
   * Return a new Asset with the amount multiplied by factor.
   */
  multiply = (factor: number | Asset | string) => {
    const other = Asset.from(factor, this.symbol);
    if (this.symbol !== other.symbol) {
      throw new Error('can not multiply with different symbols');
    }
    return new Asset(this.amount * other.amount, this.symbol);
  };

  /**
   * Return a new Asset with the amount divided.
   */
  divide = (divisor: number | Asset | string) => {
    const other = Asset.from(divisor, this.symbol);
    if (this.symbol !== other.symbol) {
      throw new Error('can not divide with different symbols');
    }

    return new Asset(this.amount / other.amount, this.symbol);
  };
  /**
   * For JSON serialization, same as toString().
   */
  toJSON = () => {
    return this.toString();
  };
}

export class Price {
  /**
   * @param base  - represents a value of the price object to be expressed relatively to quote
   *                asset. Cannot have amount == 0 if you want to build valid price.
   * @param quote - represents an relative asset. Cannot have amount == 0, otherwise
   *                asertion fail.
   *
   * Both base and quote shall have different symbol defined.
   */
  base: Asset;
  quote: Asset;
  constructor(base: Asset, quote: Asset) {
    this.base = base;
    this.quote = quote;
    if (base.amount === 0 || quote.amount === 0) {
      throw new Error('base and quote assets must be non-zero');
    }
    if (base.symbol === quote.symbol) {
      throw new Error('base and quote can not have the same symbol');
    }
  }
  /**
   * Convenience to create new Price.
   */
  static from = (value: PriceType) => {
    if (value instanceof Price) {
      return value;
    } else {
      return new Price(
        Asset.from(value.base as Asset),
        Asset.from(value.quote as Asset),
      );
    }
  };
  /**
   * Return a string representation of this price pair.
   */
  toString = () => {
    return this.base + ':' + this.quote;
  };
  /**
   * Return a new Asset with the price converted between the symbols in the pair.
   * Throws if passed asset symbol is not base or quote.
   */
  convert = (asset: Asset) => {
    if (asset.symbol === this.base.symbol) {
      if (this.base.amount <= 0) {
        throw new Error('Base amount must be greater than zero');
      }
      return new Asset(
        (asset.amount * this.quote.amount) / this.base.amount,
        this.quote.symbol,
      );
    } else if (asset.symbol === this.quote.symbol) {
      if (this.quote.amount <= 0) {
        throw new Error('Quote amount must be greater than zero');
      }
      return new Asset(
        (asset.amount * this.base.amount) / this.quote.amount,
        this.base.symbol,
      );
    } else {
      throw new Error('Can not convert ' + asset + ' with ' + this);
    }
  };
}
