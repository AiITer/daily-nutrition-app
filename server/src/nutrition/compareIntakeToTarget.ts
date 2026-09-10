// Input: nutrient intake + daily target
// Output: consumed amount, target, and remaining amount

type NutrientIntake = {
  nutrientKey: string
  amount: number
  unit: string
}

type DailyTarget =
  | {
      type: "target"
      amount: number
      unit: string
    }
  | {
      type: "range"
      minAmount: number
      maxAmount: number
      unit: string
    }
  | null

export function compareIntakeToTarget(
  intake: NutrientIntake,
  target: DailyTarget
) {
  if (!target) {
    return {
      nutrientKey: intake.nutrientKey,
      consumed: intake.amount,
      unit: intake.unit,
      targetType: "monitor"
    }
  }

 if (target.type === "range") {
  let status: "below" | "within" | "above"
  let remainingToMin = 0
  let amountAboveMax = 0

  if (intake.amount < target.minAmount) {
    status = "below"
    remainingToMin = target.minAmount - intake.amount
  } else if (intake.amount > target.maxAmount) {
    status = "above"
    amountAboveMax = intake.amount - target.maxAmount
  } else {
    status = "within"
  }

    return {
      nutrientKey: intake.nutrientKey,
      consumed: intake.amount,
      unit: intake.unit,
      targetType: "range",
      minTarget: target.minAmount,
      maxTarget: target.maxAmount,
      status,
      remainingToMin,
      amountAboveMax
    }
  }
  return {
    nutrientKey: intake.nutrientKey,
    consumed: intake.amount,
    unit: intake.unit,
    targetType: "target",
    target: target.amount,
    remaining: Math.max(target.amount - intake.amount, 0)
  }
}