// Input: USDA foodMeasures
// Output: estimated food density in g/mL

type FoodMeasure = {
  disseminationText?: string
  gramWeight?: number
}

export function getFoodDensity(
  foodMeasures: FoodMeasure[]
) {
  for (const measure of foodMeasures) {
    if (
      !measure.disseminationText ||
      !measure.gramWeight
    ) {
      continue
    }

    const text =
      measure.disseminationText.toLowerCase().trim()

    let volumeMl: number | null = null

    if (text === "1 cup") {
      volumeMl = 240
    } else if (
      text === "1 tablespoon" ||
      text === "1 tbsp"
    ) {
      volumeMl = 15
    } else if (
      text === "1 teaspoon" ||
      text === "1 tsp"
    ) {
      volumeMl = 5
    } else if (text === "1 fl oz") {
      volumeMl = 29.57
    }

    if (volumeMl !== null) {
      return measure.gramWeight / volumeMl
    }
  }

  return null
}