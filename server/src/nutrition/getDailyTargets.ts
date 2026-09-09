// Input: nutrient key + user profile
// Output: daily target for that nutrient, or null if it is monitor-only

import {
  calculateEnergyTarget,
  type ActivityLevel,
  type Sex
} from "./calculateEnergyTarget.js"

import { calculateProteinTarget } from "./calculateProteinTarget.js"
import { getAgeSexTarget } from "./getAgeSexTarget.js"
import { getAmountRange } from "./getAmountRange.js"
import { nutrientConfig } from "./nutrientConfig.js"

type Profile = {
  age: number
  sex: Sex
  heightCm: number
  weightKg: number
  activityLevel: ActivityLevel
}

export function getDailyTarget(
  nutrientKey: string,
  profile: Profile
) {
  const config = nutrientConfig.find(
    (item) => item.key === nutrientKey
  )

  if (!config || config.targetType === "monitor") {
    return null
  }

  if (nutrientKey === "energy") {
    return {
      type: "target",
      amount: calculateEnergyTarget(profile),
      unit: "kcal"
    }
  }

  if (nutrientKey === "protein") {
    const protein = calculateProteinTarget(
      profile.weightKg,
      profile.activityLevel
    )

    return {
      type: "target",
      amount: protein.amount,
      unit: "g"
    }
  }

  if (
    nutrientKey === "carbohydrate" ||
    nutrientKey === "fat"
  ) {
    const energyTarget = calculateEnergyTarget(profile)
    const range = getAmountRange(
      nutrientKey,
      energyTarget
    )

    if (!range) {
      return null
    }

    return {
      type: "range",
      minAmount: range.minAmount,
      maxAmount: range.maxAmount,
      unit: "g"
    }
  }

  const target = getAgeSexTarget(
    nutrientKey,
    profile.sex,
    profile.age
  )

  if (!target) {
    return null
  }

  return {
    type: "target",
    amount: target.amount,
    unit: target.unit
  }
}