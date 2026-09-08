// Stores recommended macronutrient ranges as percentages of total daily energy.
// These percentages are later converted into gram ranges.
export type EnergyRange = {
  nutrientKey: "carbohydrate" | "protein" | "fat"
  minPercentEnergy: number
  maxPercentEnergy: number
}

export const energyRanges: EnergyRange[] = [
  {
    nutrientKey: "carbohydrate",
    minPercentEnergy: 45,
    maxPercentEnergy: 65
  },
  {
    nutrientKey: "protein",
    minPercentEnergy: 10,
    maxPercentEnergy: 35
  },
  {
    nutrientKey: "fat",
    minPercentEnergy: 20,
    maxPercentEnergy: 35
  }
]