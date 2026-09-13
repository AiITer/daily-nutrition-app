import { normalizeUsdaNutrients } from "../nutrition/normalizeUsdaNutrients.js";
import { calculateFoodIntake } from "../nutrition/calculateFoodIntake.js";
import {
  convertFoodAmountToGrams,
  type FoodUnit,
} from "../nutrition/convertFoodAmountToGrams.js";
import { getFoodDensity } from "../nutrition/getFoodDensity.js";

function selectGenericFood(foods: any[], query: string, unit: string) {
  const normalizedQuery = query.toLowerCase().trim();

  const genericFoods = foods.filter((food: any) =>
    ["Foundation", "SR Legacy", "Survey (FNDDS)"].includes(food.dataType),
  );

  const startsWithQuery = genericFoods.filter((food: any) =>
    food.description?.toLowerCase().startsWith(normalizedQuery),
  );

  let candidates = startsWithQuery.length > 0 ? startsWithQuery : genericFoods;

  if (unit !== "g") {
    const foodsWithDensity = candidates.filter(
      (food: any) => getFoodDensity(food.foodMeasures ?? []) !== null,
    );

    if (foodsWithDensity.length > 0) {
      candidates = foodsWithDensity;
    }
  }

  const dataTypePriority: Record<string, number> = {
    Foundation: 1,
    "SR Legacy": 2,
    "Survey (FNDDS)": 3,
  };

  return candidates.sort((a: any, b: any) => {
    const typeDifference =
      (dataTypePriority[a.dataType] ?? 999) -
      (dataTypePriority[b.dataType] ?? 999);

    if (typeDifference !== 0) {
      return typeDifference;
    }

    return a.description.length - b.description.length;
  })[0];
}

export async function processFood(
  foodName: string,
  amount: number,
  unit: FoodUnit,
  apiKey: string,
) {
  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: foodName,
        pageSize: 50,
        dataType: ["Foundation", "SR Legacy", "Survey (FNDDS)"],
      }),
    },
  );

  if (!response.ok) {
    throw new Error("USDA request failed");
  }

  const data = await response.json();
  const foods = data.foods ?? [];

  const selectedFood = selectGenericFood(foods, foodName, unit);

  if (!selectedFood) {
    throw new Error("No suitable generic food found");
  }

  const density =
    unit === "g" ? undefined : getFoodDensity(selectedFood.foodMeasures ?? []);

  const grams = convertFoodAmountToGrams(amount, unit, density ?? undefined);

  if (grams === null) {
    throw new Error("Unable to convert this food from volume");
  }

  const nutrientsPer100g = normalizeUsdaNutrients(
    selectedFood.foodNutrients ?? [],
  );

  const nutrients = calculateFoodIntake(nutrientsPer100g, grams);

  return {
    foodName,
    fdcId: selectedFood.fdcId,
    usdaDescription: selectedFood.description,
    amount,
    unit,
    grams,
    density,
    nutrients,
  };
}
