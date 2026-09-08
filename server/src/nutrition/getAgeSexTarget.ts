// Looks up the correct daily intake target for a nutrient based on the user's age and sex.
// Input: nutrient key + user's sex + age
// Output: that user's daily intake target, including amount, unit, name, and RDA/AI type
import { nutrientConfig } from "./nutrientConfig.js"
import ageSexTargets from "./ageSexTargets.json" with { type: "json" }

export type AgeSexTarget = {
  nutrientKey: string
  sex: "female" | "male"
  minAge: number
  maxAge: number | null
  amount: number
  targetType: "RDA" | "AI"
}

export function getDailyIntakeTarget(
  nutrient: string,
  sex: "female" | "male",
  age: number
) {
  const target = ageSexTargets.find(
    (item) =>
      item.nutrientKey === nutrient &&
      item.sex === sex &&
      age >= item.minAge &&
      (item.maxAge === null || age <= item.maxAge)
  )

  //console.log("matched target:", target)

  if (!target) {
    return null
  }

  const config = nutrientConfig.find(
    (item) => item.key === nutrient
  )
//   console.log(
//   "config keys:",
//   nutrientConfig.map((item) => item.key)
// )

  if (!config) {
    return null
  }

  return {
    nutrient: config.name,
    amount: target.amount,
    unit: config.unit,
    targetType: config.targetType
  }
}