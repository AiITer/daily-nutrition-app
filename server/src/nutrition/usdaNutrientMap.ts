// Input: USDA nutrient ID
// Output: nutrient key used inside this app

export const usdaNutrientMap: Record<number, string> = {
  // Macronutrients
  1003: "protein",
  1004: "fat",
  1005: "carbohydrate",
  1008: "energy",
  2047: "energy",
  2048: "energy",
  1051: "water",
  1079: "fiber",

  // Vitamins
  1106: "vitaminA",
  1109: "vitaminE",
  1114: "vitaminD",
  1162: "vitaminC",
  1165: "vitaminB1",
  1166: "vitaminB2",
  1167: "vitaminB3",
  1170: "vitaminB5",
  1175: "vitaminB6",
  1176: "vitaminB7",
  1177: "vitaminB9",
  1178: "vitaminB12",
  1180: "choline",
  1185: "vitaminK",

  // Minerals
  1087: "calcium",
  1089: "iron",
  1090: "magnesium",
  1091: "phosphorus",
  1092: "potassium",
  1093: "sodium",
  1095: "zinc",
  1098: "copper",
  1099: "fluoride",
  1100: "iodine",
  1101: "manganese",
  1102: "molybdenum",
  1103: "selenium",

  // Essential fatty acids
  1269: "linoleicAcid",
  1270: "alphaLinolenicAcid",

  // Monitor-only nutrients
  1253: "cholesterol",
  1257: "transFat",
  1258: "saturatedFat",
  2000: "totalSugar"
}