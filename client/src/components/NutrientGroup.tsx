import FoodSuggestions from "./FoodSuggestions";

type NutrientGroupProps = {
  title: string;
  groupName: "macronutrients" | "vitamins" | "minerals";
  nutrientKeys: string[];
  mealId: number;

  nutrition: any[];
  nutritionStatus: any[];
  isExpanded: boolean;

  recommendationNutrientKeys: string[];
  expandedRecommendation: {
    mealId: number;
    nutrientKey: string;
    section: "nutrition" | "remaining";
  } | null;

  recommendations: any[];
  showAllRecommendations: boolean;

  onToggle: (
    mealId: number,
    group: "macronutrients" | "vitamins" | "minerals",
  ) => void;

  onLoadRecommendations: (
    mealId: number,
    nutrientKey: string,
    section: "nutrition" | "remaining",
  ) => void;

  setShowAllRecommendations: (value: boolean) => void;

  getDailyNeedText: (status: any) => string | null;
  getNutrientDisplayName: (nutrientKey: string) => string;
  formatNumber: (value: number | string) => number;
};

function NutrientGroup({
  title,
  groupName,
  nutrientKeys,
  mealId,
  nutrition,
  nutritionStatus,
  isExpanded,
  recommendationNutrientKeys,
  expandedRecommendation,
  recommendations,
  showAllRecommendations,
  onToggle,
  onLoadRecommendations,
  setShowAllRecommendations,
  getDailyNeedText,
  getNutrientDisplayName,
  formatNumber,
}: NutrientGroupProps) {
  const visibleNutrientKeys = isExpanded
    ? nutrientKeys
    : nutrientKeys.slice(0, 5);

  return (
    <div>
      <h4>{title}</h4>

      {visibleNutrientKeys.map((nutrientKey) => {
        const nutrient = nutrition.find(
          (item: any) => item.nutrientKey === nutrientKey,
        );

        const status = nutritionStatus.find(
          (item: any) => item.nutrientKey === nutrientKey,
        );

        const consumed = nutrient?.amount ?? 0;
        const unit = nutrient?.unit ?? status?.unit ?? "";
        const dailyNeed = getDailyNeedText(status);

        return (
          <div key={nutrientKey}>
            <p>
              {getNutrientDisplayName(nutrientKey)}: {formatNumber(consumed)}{" "}
              {unit}
            </p>

            {dailyNeed && <p>Daily Need: {dailyNeed}</p>}

            {recommendationNutrientKeys.includes(nutrientKey) && (
              <FoodSuggestions
                mealId={mealId}
                nutrientKey={nutrientKey}
                section="nutrition"
                expandedRecommendation={expandedRecommendation}
                recommendations={recommendations}
                showAllRecommendations={showAllRecommendations}
                onLoadRecommendations={onLoadRecommendations}
                setShowAllRecommendations={setShowAllRecommendations}
                formatNumber={formatNumber}
              />
            )}
          </div>
        );
      })}

      {nutrientKeys.length > 5 && (
        <button type="button" onClick={() => onToggle(mealId, groupName)}>
          {isExpanded ? "See Less" : "See More"}
        </button>
      )}
    </div>
  );
}

export default NutrientGroup;