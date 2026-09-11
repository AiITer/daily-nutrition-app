import express from "express";
import cors from "cors";
import "dotenv/config";
import { normalizeUsdaNutrients } from "./nutrition/normalizeUsdaNutrients.js";
import { calculateFoodIntake } from "./nutrition/calculateFoodIntake.js";
import { getDailyTarget } from "./nutrition/getDailyTarget.js";
import { compareIntakeToTarget } from "./nutrition/compareIntakeToTarget.js";
import { getFoodDensity } from "./nutrition/getFoodDensity.js";
import {
  convertFoodAmountToGrams,
  type FoodUnit,
} from "./nutrition/convertFoodAmountToGrams.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/foods/search", async (req, res) => {
  const query = req.query.q;

  if (typeof query !== "string" || !query.trim()) {
    return res.status(400).json({
      error: "Search query is required",
    });
  }

  const apiKey = process.env.USDA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "USDA API key is not configured",
    });
  }

  const url = new URL("https://api.nal.usda.gov/fdc/v1/foods/search");

  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("query", query);
  url.searchParams.set("pageSize", "60");

  const response = await fetch(url);
  console.log("USDA search request:", query);

  if (!response.ok) {
    return res.status(response.status).json({
      error: "Failed to search USDA foods",
    });
  }

  const data = await response.json();
  const foods = data.foods ?? [];

  function selectGenericFood(foods: any[], query: string, unit: string) {
    const normalizedQuery = query.toLowerCase().trim();

    const genericFoods = foods.filter((food: any) =>
      ["Foundation", "SR Legacy", "Survey (FNDDS)"].includes(food.dataType),
    );

    const startsWithQuery = genericFoods.filter((food: any) =>
      food.description?.toLowerCase().startsWith(normalizedQuery),
    );

    let candidates =
      startsWithQuery.length > 0 ? startsWithQuery : genericFoods;

    const needsDensity = unit !== "g";

    if (needsDensity) {
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

  const amount = Number(req.query.amount) || 100;

  const unit = typeof req.query.unit === "string" ? req.query.unit : "g";

  const selectedFood = selectGenericFood(foods, query, unit);
  if (!selectedFood) {
    return res.status(404).json({
      error: "No suitable generic food found",
    });
  }

  const nutrients = normalizeUsdaNutrients(selectedFood.foodNutrients ?? []);

  const density =
    unit === "g" ? undefined : getFoodDensity(selectedFood.foodMeasures ?? []);

  const grams = convertFoodAmountToGrams(
    amount,
    unit as FoodUnit,
    density ?? undefined,
  );

  if (grams === null) {
    return res.status(400).json({
      error: "Unable to convert this food from volume. Please enter grams.",
    });
  }

  const intake = calculateFoodIntake(nutrients, grams);

  const testProfile = {
    age: 35,
    sex: "female" as const,
    heightCm: 165,
    weightKg: 60,
    activityLevel: "active" as const,
  };

  const nutritionSummary = intake.map((item) => {
    const target = getDailyTarget(item.nutrientKey, testProfile);

    return compareIntakeToTarget(item, target);
  });

  res.json({
    name: query.trim(),
    amount,
    unit,
    grams,
    density,
    fdcId: selectedFood.fdcId,
    usdaDescription: selectedFood.description,
    nutrients: nutritionSummary,
  });
});

app.get("/api/debug/usda", async (req, res) => {
  const query = req.query.q;

  if (typeof query !== "string" || !query.trim()) {
    return res.status(400).json({
      error: "Search query is required",
    });
  }

  const apiKey = process.env.USDA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "USDA API key is not configured",
    });
  }

  const url = new URL("https://api.nal.usda.gov/fdc/v1/foods/search");

  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("query", query);
  url.searchParams.set("pageSize", "10");

  const response = await fetch(
    "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=" + apiKey,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        pageSize: 20,
        dataType: ["Foundation", "SR Legacy", "Survey (FNDDS)"],
      }),
    },
  );

  if (!response.ok) {
    return res.status(response.status).json({
      error: "USDA request failed",
    });
  }

  const data = await response.json();

  const results = (data.foods ?? []).map((food: any) => ({
    fdcId: food.fdcId,
    description: food.description,
    dataType: food.dataType,
    foodMeasures: food.foodMeasures ?? [],
    nutrients: (food.foodNutrients ?? []).map((nutrient: any) => ({
      id: nutrient.nutrientId,
      name: nutrient.nutrientName,
      unit: nutrient.unitName,
      value: nutrient.value,
    })),
  }));

  res.json(results);
});

app.get("/api/debug/usda/:fdcId", async (req, res) => {
  const apiKey = process.env.USDA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "USDA API key is not configured",
    });
  }

  const { fdcId } = req.params;

  const url = new URL(`https://api.nal.usda.gov/fdc/v1/food/${fdcId}`);

  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    return res.status(response.status).json({
      error: "USDA food details request failed",
    });
  }

  const data = await response.json();

  res.json({
    fdcId: data.fdcId,
    description: data.description,
    dataType: data.dataType,
    servingSize: data.servingSize,
    servingSizeUnit: data.servingSizeUnit,
    foodPortions: data.foodPortions ?? [],
    foodMeasures: data.foodMeasures ?? [],
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
