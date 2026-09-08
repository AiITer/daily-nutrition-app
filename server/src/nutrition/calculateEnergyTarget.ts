// Calculates the user's estimated daily energy requirement from profile information.
// Input: age + sex + height + weight + activity level
// Output: estimated daily energy requirement in kcal
export type Sex = "female" | "male"

export type ActivityLevel =
  | "inactive"
  | "lowActive"
  | "active"
  | "veryActive"

type EnergyProfile = {
  age: number
  sex: Sex
  heightCm: number
  weightKg: number
  activityLevel: ActivityLevel
}

export function calculateEnergyTarget(profile: EnergyProfile) {
  const {
    age,
    sex,
    heightCm,
    weightKg,
    activityLevel
  } = profile

  if (sex === "female") {
    switch (activityLevel) {
      case "inactive":
        return 584.90 - 7.01 * age + 5.72 * heightCm + 11.71 * weightKg

      case "lowActive":
        return 575.77 - 7.01 * age + 6.60 * heightCm + 12.14 * weightKg

      case "active":
        return 710.25 - 7.01 * age + 6.54 * heightCm + 12.34 * weightKg

      case "veryActive":
        return 511.83 - 7.01 * age + 9.07 * heightCm + 12.56 * weightKg
    }
  }

  switch (activityLevel) {
    case "inactive":
      return 753.07 - 10.83 * age + 6.50 * heightCm + 14.10 * weightKg

    case "lowActive":
      return 581.47 - 10.83 * age + 8.30 * heightCm + 14.94 * weightKg

    case "active":
      return 1004.82 - 10.83 * age + 6.52 * heightCm + 15.91 * weightKg

    case "veryActive":
      return -517.88 - 10.83 * age + 15.61 * heightCm + 19.11 * weightKg
  }
}