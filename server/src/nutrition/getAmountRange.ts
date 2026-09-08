// Converts an energy-percentage range into a practical gram range.
// Input: nutrient key + daily energy target
// Output: recommended gram range for carbohydrate, protein, or fat
import { energyRanges } from "./energyRanges.js"

const caloriesPerGram = {
  fat: 9,
  protein: 4,
  carbohydrate: 4
}

export function getAmountRange(
  nutrientKey: keyof typeof caloriesPerGram,
  energyTarget: number
) {
  const range = energyRanges.find(
    (item) => item.nutrientKey === nutrientKey
  )

  if (!range) {
    return null
  }

  const minAmount =
    (energyTarget * (range.minPercentEnergy / 100)) /
    caloriesPerGram[nutrientKey]

  const maxAmount =
    (energyTarget * (range.maxPercentEnergy / 100)) /
    caloriesPerGram[nutrientKey]

  return {
    nutrientKey,
    minAmount,
    maxAmount
  }
}