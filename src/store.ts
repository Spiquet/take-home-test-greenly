import { DiscountOffer } from "./DiscountOffer";

export const DiscountOffers = new Map([
  [
    "Naturalia",
    (expiresIn: number, discountInPercent: number) => {
      expiresIn = expiresIn - 1;
      if (discountInPercent < 50) {
        expiresIn < 0 ? (discountInPercent += 2) : (discountInPercent += 1);
      }
      return { expiresIn, discountInPercent };
    }
  ],
  [
    "Ilek",
    (expiresIn: number, discountInPercent: number) => ({
      expiresIn,
      discountInPercent
    })
  ],
  [
    "Vinted",
    (expiresIn: number, discountInPercent: number) => {
      expiresIn = expiresIn - 1;
      if (discountInPercent < 50) {
        discountInPercent = discountInPercent + 1;
        expiresIn < 11 && (discountInPercent += 1);
        expiresIn < 6 && (discountInPercent += 1);
        expiresIn < 0 && (discountInPercent = 0);
      }
      return { expiresIn, discountInPercent };
    }
  ]
]);

export class Store {
  public discountOffers: DiscountOffer[];

  constructor(discountOffers: DiscountOffer[] = []) {
    this.discountOffers = discountOffers;
  }

  defaultComputeDiscount(expiresIn: number, discountInPercent: number) {
    expiresIn = expiresIn - 1;
    if (discountInPercent > 0) {
      expiresIn < 0 ? (discountInPercent -= 2) : (discountInPercent -= 1);
    }
    return { expiresIn, discountInPercent };
  }

  getComputeDiscountMethod(partnerName: string) {
    if (DiscountOffers.has(partnerName)) {
      return DiscountOffers.get(partnerName);
    }
    return this.defaultComputeDiscount;
  }

  updateDiscounts(): DiscountOffer[] {
    return this.discountOffers = this.discountOffers.map(discountOffer => {
      let discountComputingFunction = this.getComputeDiscountMethod(
        discountOffer.partnerName
      );
      const { expiresIn, discountInPercent } = discountComputingFunction(
        discountOffer.expiresIn,
        discountOffer.discountInPercent
      );
      return {
        ...discountOffer,
        expiresIn,
        discountInPercent
      };
    });
  }
}