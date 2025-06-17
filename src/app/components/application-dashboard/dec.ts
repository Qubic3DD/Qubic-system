export class BigDecimal {
  constructor(private value: string) {}

  static fromNumber(num: number): BigDecimal {
    return new BigDecimal(num.toString());
  }

  plus(other: BigDecimal): BigDecimal {
    return new BigDecimal((parseFloat(this.value) + parseFloat(other.value)).toString());
  }

  toString(): string {
    return this.value;
  }

  toNumber(): number {
    return parseFloat(this.value);
  }
}