import { DiscountOffer } from "../src/DiscountOffer";
import { Store } from "../src/store";

describe("Store", () => {
  describe("Normal partners", () => {
    it("should decrease the discount and expiresIn", () => {
      expect(
        new Store([new DiscountOffer("test", 2, 3)]).updateDiscounts()
      ).toEqual([new DiscountOffer("test", 1, 2)]);
    });

    it("should decrease twice as fast after the expiration date", () => {
      expect(
        new Store([new DiscountOffer("test", -1, 3)]).updateDiscounts()
      ).toEqual([new DiscountOffer("test", -2, 1)]);
    });

    it("should not decrease the discount when it's at 0", () => {
      expect(
        new Store([new DiscountOffer("test", 10, 0)]).updateDiscounts()
      ).toEqual([new DiscountOffer("test", 9, 0)]);
    });
  });

  describe("Special partners", () => {
    describe("Naturalia", () => {
      it("should not increase the discount when it's at 50", () => {
        expect(
          new Store([new DiscountOffer("Naturalia", 10, 50)]).updateDiscounts()
        ).toEqual([new DiscountOffer("Naturalia", 9, 50)]);
      });

      it("should increase the discount as the product ages", () => {
        expect(
          new Store([new DiscountOffer("Naturalia", 2, 3)]).updateDiscounts()
        ).toEqual([new DiscountOffer("Naturalia", 1, 4)]);
      });

      it("should increase the discount twice as fast after the expiration date", () => {
        expect(
          new Store([new DiscountOffer("Naturalia", -1, 4)]).updateDiscounts()
        ).toEqual([new DiscountOffer("Naturalia", -2, 6)]);
      });
    });

    describe("Ilek", () => {
      it("should not change the discount and keep the expiration date", () => {
        expect(
          new Store([new DiscountOffer("Ilek", 15, 44)]).updateDiscounts()
        ).toEqual([new DiscountOffer("Ilek", 15, 44)]);
      });
    });

    describe("Vinted", () => {
      it("should not increase the discount when it's at 50", () => {
        expect(
          new Store([new DiscountOffer("Naturalia", 10, 44)]).updateDiscounts()
        ).toEqual([new DiscountOffer("Naturalia", 9, 45)]);
      });

      it("should increase the discount by two 10 days or less before the offer expires", () => {
        expect(
          new Store([new DiscountOffer("Vinted", 8, 4)]).updateDiscounts()
        ).toEqual([new DiscountOffer("Vinted", 7, 6)]);
      });

      it("should increase the discount by three 5 days or less before the offer expires", () => {
        expect(
          new Store([new DiscountOffer("Vinted", 5, 4)]).updateDiscounts()
        ).toEqual([new DiscountOffer("Vinted", 4, 7)]);
      });

      it("the discount should be 0 after the expiration date", () => {
        expect(
          new Store([new DiscountOffer("Vinted", -1, 4)]).updateDiscounts()
        ).toEqual([new DiscountOffer("Vinted", -2, 0)]);
      });
    });
  });
})
