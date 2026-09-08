// Temporary development tests for the nutrition target logic.
// Used to verify lookup, energy, protein, and macronutrient range calculations.
import { getDailyIntakeTarget } from "./getDailyIntakeTarget.js"
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