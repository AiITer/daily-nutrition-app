// Input: normalized nutrient values per 100 g + food weight in grams
// Output: actual nutrient intake for the entered food amount

type NutrientPer100g = {
  nutrientKey: string
  amount: number
  unit: string
}

export function calculateFoodIntake(
  nutrients: NutrientPer100g[],
  foodWeightGrams: number
) {
  return nutrients.map((item) => ({
    nutrientKey: item.nutrientKey,
    amount: item.amount * foodWeightGrams / 100,
    unit: item.unit
  }))
}