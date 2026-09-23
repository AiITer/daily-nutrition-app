import nutrientRecommendations from "../data/nutrientRecommendations.json" with { type: "json" };

export type NutrientRecommendation = {
  foodName: string;
  displayName: string;
  nutrientAmountPer100Units: number;
  unit: string;
  basisUnit: "g" | "mL";
  foodId: string;
  source: string;
};

const recommendationData = nutrientRecommendations as Record<
  string,
  NutrientRecommendation[]
>;

export function getNutrientRecommendations(
  nutrientKey: string,
): NutrientRecommendation[] | null {
  return recommendationData[nutrientKey] ?? null;
}
