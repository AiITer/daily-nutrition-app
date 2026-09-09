// Input: USDA foodNutrients array
// Output: nutrients recognized and normalized by this app

import { usdaNutrientMap } from "./usdaNutrientMap.js"
import { nutrientConfig } from "./nutrientConfig.js"

type UsdaNutrient = {
  nutrientId: number
  nutrientName: string
  unitName: string
  value: number
}

const supportedNutrients = new Set(
  nutrientConfig.map((item) => item.key)
)

export function normalizeUsdaNutrients(
  foodNutrients: UsdaNutrient[]
) {
  return foodNutrients
    .map((item) => {
      const nutrientKey = usdaNutrientMap[item.nutrientId]

      if (
        !nutrientKey ||
        !supportedNutrients.has(nutrientKey)
      ) {
        return null
      }

      return {
        nutrientKey,
        amount: item.value,
        unit: item.unitName.toLowerCase()
      }
    })
    .filter((item) => item !== null)
}