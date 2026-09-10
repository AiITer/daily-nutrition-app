// Input: USDA foodNutrients array
// Output: app nutrients converted to the units defined in nutrientConfig

import { usdaNutrientMap } from "./usdaNutrientMap.js"
import { nutrientConfig } from "./nutrientConfig.js"

type UsdaNutrient = {
  nutrientId: number
  nutrientName: string
  unitName: string
  value: number
}

function convertUnit(
  nutrientKey: string,
  amount: number,
  sourceUnit: string,
  targetUnit: string
) {
  const source =
    sourceUnit.toLowerCase() === "ug"
      ? "mcg"
      : sourceUnit.toLowerCase()

  if (source === targetUnit) {
    return amount
  }

  if (source === "mg" && targetUnit === "mcg") {
    return amount * 1000
  }

  if (source === "mcg" && targetUnit === "mg") {
    return amount / 1000
  }

  if (
    nutrientKey === "water" &&
    source === "g" &&
    targetUnit === "L"
  ) {
    return amount / 1000
  }

  return amount
}

export function normalizeUsdaNutrients(
  foodNutrients: UsdaNutrient[]
) {
  return foodNutrients
    .map((item) => {
      const nutrientKey =
        usdaNutrientMap[item.nutrientId]

      if (!nutrientKey) {
        return null
      }

      const config = nutrientConfig.find(
        (item) => item.key === nutrientKey
      )

      if (!config) {
        return null
      }

      return {
        nutrientKey,
        amount: convertUnit(
          nutrientKey,
          item.value,
          item.unitName,
          config.unit
        ),
        unit: config.unit
      }
    })
    .filter((item) => item !== null)
}