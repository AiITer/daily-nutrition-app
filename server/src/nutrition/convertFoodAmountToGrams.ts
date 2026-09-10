// Input: food amount + unit + food density
// Output: food weight in grams

export type FoodUnit = "g" | "mL" | "L" | "tsp"

export function convertFoodAmountToGrams(
  amount: number,
  unit: FoodUnit,
  density?: number
) {
  if (unit === "g") {
    return amount
  }

  if (!density) {
    return null
  }

  let volumeMl = amount

  if (unit === "L") {
    volumeMl = amount * 1000
  }

  if (unit === "tsp") {
    volumeMl = amount * 5
  }

  return volumeMl * density
}