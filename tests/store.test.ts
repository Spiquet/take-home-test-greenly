import fs from "fs";
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

  it("should check the raw discount simulation has the same output as the old version", () => {
    const discountOffers = [
      new DiscountOffer("Velib", 20, 30),
      new DiscountOffer("Naturalia", 10, 5),
      new DiscountOffer("Vinted", 5, 40),
      new DiscountOffer("Ilek", 15, 40)
    ];

    let output = JSON.parse(`[${fs.readFileSync("output.txt").toString()}]`);
    const store = new Store(discountOffers);
    const newLogs: DiscountOffer[] = [];

    for (let elapsedDays = 0; elapsedDays < 30; elapsedDays++) {
      newLogs.push(JSON.parse(JSON.stringify(store.updateDiscounts())));
    }
    expect(newLogs).toStrictEqual(output);
  });
})
