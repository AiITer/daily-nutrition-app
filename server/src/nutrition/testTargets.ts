// Temporary development tests for the nutrition target logic.
// Used to verify lookup, energy, protein, and macronutrient range calculations.
import { getDailyIntakeTarget } from "./getAgeSexTarget.js"
import { calculateEnergyTarget } from "./calculateEnergyTarget.js"
import { calculateProteinTarget } from "./calculateProteinTarget.js"
import { getAmountRange } from "./getAmountRange.js"


console.log(
  "Vitamin A:",
  getDailyIntakeTarget("vitaminA", "female", 35)
)

const testProfile = {
  age: 35,
  sex: "female" as const,
  heightCm: 165,
  weightKg: 60,
  activityLevel: "active" as const
}

const energyTarget = calculateEnergyTarget(testProfile)

console.log("Energy:", energyTarget)

console.log(
  "Protein:",
  calculateProteinTarget(
    testProfile.weightKg,
    testProfile.activityLevel
  )
)

console.log(
  "Carbohydrate range:",
  getAmountRange("carbohydrate", energyTarget)
)

console.log(
  "Protein range:",
  getAmountRange("protein", energyTarget)
)

console.log(
  "Fat range:",
  getAmountRange("fat", energyTarget)
)

import ageSexTargets from "./ageSexTargets.json" with { type: "json" }
import { nutrientConfig } from "./nutrientConfig.js"

const configKeys = new Set(
  nutrientConfig.map((item) => item.key)
)

const missingConfigKeys = [
  ...new Set(
    ageSexTargets
      .map((item) => item.nutrientKey)
      .filter((key) => !configKeys.has(key))
  )
]

console.log("Missing config keys:", missingConfigKeys)

import { normalizeUsdaNutrients } from "./normalizeUsdaNutrients.js"

const testUsdaNutrients = [
  {
    nutrientId: 1003,
    nutrientName: "Protein",
    unitName: "G",
    value: 2.57
  },
  {
    nutrientId: 2000,
    nutrientName: "Total Sugars",
    unitName: "G",
    value: 1.7
  },
  {
    nutrientId: 999999,
    nutrientName: "Unknown",
    unitName: "G",
    value: 5
  }
]

console.log(
  "Normalized USDA nutrients:",
  normalizeUsdaNutrients(testUsdaNutrients)
)