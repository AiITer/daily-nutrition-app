import { describe, expect, it } from "vitest";
import { calculateFoodIntake } from "./calculateFoodIntake.js";
import { convertFoodAmountToGrams } from "./convertFoodAmountToGrams.js";
import { compareIntakeToTarget } from "./compareIntakeToTarget.js";

describe("calculateFoodIntake", () => {
  it("scales nutrient amounts according to food weight", () => {
    const nutrients = [
      {
        nutrientKey: "protein",
        amount: 10,
        unit: "g",
      },
      {
        nutrientKey: "calcium",
        amount: 120,
        unit: "mg",
      },
    ];

    const result = calculateFoodIntake(nutrients, 150);

    expect(result).toEqual([
      {
        nutrientKey: "protein",
        amount: 15,
        unit: "g",
      },
      {
        nutrientKey: "calcium",
        amount: 180,
        unit: "mg",
      },
    ]);
  });

  it("returns zero intake when food weight is zero", () => {
    const result = calculateFoodIntake(
      [
        {
          nutrientKey: "protein",
          amount: 10,
          unit: "g",
        },
      ],
      0,
    );

    expect(result[0]?.amount).toBe(0);
  });
});

describe("convertFoodAmountToGrams", () => {
  it("keeps gram input unchanged", () => {
    expect(convertFoodAmountToGrams(150, "g")).toBe(150);
  });

  it("converts milliliters to grams using density", () => {
    expect(convertFoodAmountToGrams(200, "mL", 1.03)).toBeCloseTo(206);
  });

  it("converts liters to milliliters before applying density", () => {
    expect(convertFoodAmountToGrams(1, "L", 1.03)).toBeCloseTo(1030);
  });

  it("converts teaspoons to milliliters before applying density", () => {
    expect(convertFoodAmountToGrams(2, "tsp", 1.03)).toBeCloseTo(10.3);
  });

  it("returns null for volume units when density is missing", () => {
    expect(convertFoodAmountToGrams(200, "mL")).toBeNull();
  });
});

describe("compareIntakeToTarget", () => {
  it("calculates remaining amount for a fixed target", () => {
    const result = compareIntakeToTarget(
      {
        nutrientKey: "protein",
        amount: 30,
        unit: "g",
      },
      {
        type: "target",
        amount: 50,
        unit: "g",
      },
    );

    expect(result).toEqual({
      nutrientKey: "protein",
      consumed: 30,
      unit: "g",
      targetType: "target",
      target: 50,
      remaining: 20,
    });
  });

  it("does not return negative remaining amount when target is exceeded", () => {
    const result = compareIntakeToTarget(
      {
        nutrientKey: "protein",
        amount: 70,
        unit: "g",
      },
      {
        type: "target",
        amount: 50,
        unit: "g",
      },
    );

    expect(result.remaining).toBe(0);
  });

  it("marks intake below a target range", () => {
    const result = compareIntakeToTarget(
      {
        nutrientKey: "fat",
        amount: 40,
        unit: "g",
      },
      {
        type: "range",
        minAmount: 50,
        maxAmount: 80,
        unit: "g",
      },
    );

    expect(result.status).toBe("below");
    expect(result.remainingToMin).toBe(10);
  });

  it("marks intake within a target range", () => {
    const result = compareIntakeToTarget(
      {
        nutrientKey: "fat",
        amount: 60,
        unit: "g",
      },
      {
        type: "range",
        minAmount: 50,
        maxAmount: 80,
        unit: "g",
      },
    );

    expect(result.status).toBe("within");
  });

  it("marks intake above a target range", () => {
    const result = compareIntakeToTarget(
      {
        nutrientKey: "fat",
        amount: 90,
        unit: "g",
      },
      {
        type: "range",
        minAmount: 50,
        maxAmount: 80,
        unit: "g",
      },
    );

    expect(result.status).toBe("above");
    expect(result.amountAboveMax).toBe(10);
  });

  it("treats nutrients without a target as monitor-only", () => {
    const result = compareIntakeToTarget(
      {
        nutrientKey: "sugar",
        amount: 25,
        unit: "g",
      },
      null,
    );

    expect(result).toEqual({
      nutrientKey: "sugar",
      consumed: 25,
      unit: "g",
      targetType: "monitor",
    });
  });
});
