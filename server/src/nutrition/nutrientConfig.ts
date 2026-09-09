// Defines each nutrient's basic metadata, such as display name, unit, and target type.
export type NutrientConfig = {
  key: string
  name: string
  unit: "g" | "mg" | "mcg" | "L" | "kcal"
  targetType: "RDA" | "AI" | "calculated" | "range" | "monitor"
}

export const nutrientConfig: NutrientConfig[] = [
  // Energy and macronutrients
  {
    key: "energy",
    name: "Energy",
    unit: "kcal",
    targetType: "calculated"
  },
  {
    key: "carbohydrate",
    name: "Carbohydrate",
    unit: "g",
    targetType: "RDA"
  },
  {
    key: "protein",
    name: "Protein",
    unit: "g",
    targetType: "calculated"
  },
  {
    key: "fat",
    name: "Fat",
    unit: "g",
    targetType: "range"
  },
  {
    key: "linoleicAcid",
    name: "Linoleic Acid (Omega-6)",
    unit: "g",
    targetType: "AI"
  },
  {
    key: "alphaLinolenicAcid",
    name: "Alpha-Linolenic Acid (Omega-3)",
    unit: "g",
    targetType: "AI"
  },
  {
    key: "fiber",
    name: "Fibre",
    unit: "g",
    targetType: "AI"
  },
  {
    key: "water",
    name: "Water",
    unit: "L",
    targetType: "AI"
  },

  // Vitamins
  {
    key: "vitaminA",
    name: "Vitamin A",
    unit: "mcg",
    targetType: "RDA"
  },
  {
    key: "vitaminC",
    name: "Vitamin C",
    unit: "mg",
    targetType: "RDA"
  },
  {
    key: "vitaminD",
    name: "Vitamin D",
    unit: "mcg",
    targetType: "RDA"
  },
  {
    key: "vitaminE",
    name: "Vitamin E",
    unit: "mg",
    targetType: "RDA"
  },
  {
    key: "vitaminK",
    name: "Vitamin K",
    unit: "mcg",
    targetType: "AI"
  },
  {
    key: "vitaminB1",
    name: "Thiamin (Vitamin B1)",
    unit: "mg",
    targetType: "RDA"
  },
  {
    key: "vitaminB2",
    name: "Riboflavin (Vitamin B2)",
    unit: "mg",
    targetType: "RDA"
  },
  {
    key: "vitaminB3",
    name: "Niacin (Vitamin B3)",
    unit: "mg",
    targetType: "RDA"
  },
  {
    key: "vitaminB5",
    name: "Pantothenic Acid (Vitamin B5)",
    unit: "mg",
    targetType: "AI"
  },
  {
    key: "vitaminB6",
    name: "Vitamin B6",
    unit: "mg",
    targetType: "RDA"
  },
  {
    key: "vitaminB7",
    name: "Biotin (Vitamin B7)",
    unit: "mcg",
    targetType: "AI"
  },
  {
    key: "vitaminB9",
    name: "Folate (Vitamin B9)",
    unit: "mcg",
    targetType: "RDA"
  },
  {
    key: "vitaminB12",
    name: "Vitamin B12",
    unit: "mcg",
    targetType: "RDA"
  },
  {
    key: "choline",
    name: "Choline",
    unit: "mg",
    targetType: "AI"
  },

  // Elements
  {
    key: "calcium",
    name: "Calcium",
    unit: "mg",
    targetType: "RDA"
  },
  // {
  //   key: "chromium",
  //   name: "Chromium",
  //   unit: "mcg",
  //   targetType: "AI"
  // },
  {
    key: "copper",
    name: "Copper",
    unit: "mcg",
    targetType: "RDA"
  },
  {
    key: "fluoride",
    name: "Fluoride",
    unit: "mg",
    targetType: "AI"
  },
  {
    key: "iodine",
    name: "Iodine",
    unit: "mcg",
    targetType: "RDA"
  },
  {
    key: "iron",
    name: "Iron",
    unit: "mg",
    targetType: "RDA"
  },
  {
    key: "magnesium",
    name: "Magnesium",
    unit: "mg",
    targetType: "RDA"
  },
  {
    key: "manganese",
    name: "Manganese",
    unit: "mg",
    targetType: "AI"
  },
  {
    key: "molybdenum",
    name: "Molybdenum",
    unit: "mcg",
    targetType: "RDA"
  },
  {
    key: "phosphorus",
    name: "Phosphorus",
    unit: "mg",
    targetType: "RDA"
  },
  {
    key: "potassium",
    name: "Potassium",
    unit: "mg",
    targetType: "AI"
  },
  {
    key: "selenium",
    name: "Selenium",
    unit: "mcg",
    targetType: "RDA"
  },
  {
    key: "sodium",
    name: "Sodium",
    unit: "mg",
    targetType: "AI"
  },
  // {
  //   key: "chloride",
  //   name: "Chloride",
  //   unit: "mg",
  //   targetType: "AI"
  // },
  {
    key: "zinc",
    name: "Zinc",
    unit: "mg",
    targetType: "RDA"
  },
  {
  key: "totalSugar",
  name: "Total Sugar",
  unit: "g",
  targetType: "monitor"
},
{
  key: "saturatedFat",
  name: "Saturated Fat",
  unit: "g",
  targetType: "monitor"
},
{
  key: "transFat",
  name: "Trans Fat",
  unit: "g",
  targetType: "monitor"
},
{
  key: "cholesterol",
  name: "Cholesterol",
  unit: "mg",
  targetType: "monitor"
}
]