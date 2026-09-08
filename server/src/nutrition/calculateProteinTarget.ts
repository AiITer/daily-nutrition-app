// Estimates a daily protein target from body weight and activity level.
// Input: body weight + activity level
// Output: estimated daily protein target and grams-per-kg value
import type { ActivityLevel } from "./calculateEnergyTarget.js"

export function calculateProteinTarget(
  weightKg: number,
  activityLevel: ActivityLevel
) {
  let gramsPerKg = 0.8

  if (activityLevel === "lowActive") {
    gramsPerKg = 1.2
  }

  if (activityLevel === "active") {
    gramsPerKg = 1.6
  }

  if (activityLevel === "veryActive") {
    gramsPerKg = 2.0
  }

  return {
    amount: weightKg * gramsPerKg,
    gramsPerKg
  }
}