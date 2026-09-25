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
  const orderedKeys = nutrientKeys
    .map((nutrientKey, index) => {
      const nutrient = nutrition.find(
        (item: any) => item.nutrientKey === nutrientKey,
      );
      const status = nutritionStatus.find(
        (item: any) => item.nutrientKey === nutrientKey,
      );

      const consumed = Number(nutrient?.amount ?? status?.consumed ?? 0);

      return {
        nutrientKey,
        index,
        consumed: Number.isFinite(consumed) ? consumed : 0,
      };
    })
    .sort((a, b) => {
      const aIsZero = a.consumed === 0;
      const bIsZero = b.consumed === 0;

      if (aIsZero !== bIsZero) {
        return aIsZero ? 1 : -1;
      }

      return a.index - b.index;
    })
    .map((item) => item.nutrientKey);

  const visibleKeys = isExpanded ? orderedKeys : orderedKeys.slice(0, 7);

  return (
    <section className="nutrient-group">
      <div className="nutrient-table-header">
        <strong>{title}</strong>
        <span>Consumed</span>
        <span>Daily Need</span>
        <span aria-hidden="true" />
      </div>

      <div className="nutrient-list">
        {visibleKeys.map((nutrientKey) => {
          const nutrient = nutrition.find(
            (item: any) => item.nutrientKey === nutrientKey,
          );

          const status = nutritionStatus.find(
            (item: any) => item.nutrientKey === nutrientKey,
          );

          const consumed = Number(nutrient?.amount ?? status?.consumed ?? 0);
          const unit = nutrient?.unit ?? status?.unit ?? "";
          const dailyNeed = getDailyNeedText(status);

          return (
            <div className="nutrient-row" key={nutrientKey}>
              <strong className="nutrient-name">
                {getNutrientDisplayName(nutrientKey)}
              </strong>

              <span className="nutrient-value">
                {formatNumber(consumed)} {unit}
              </span>

              <span className="nutrient-need">{dailyNeed ?? "—"}</span>

              {recommendationNutrientKeys.includes(nutrientKey) ? (
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
              ) : (
                <span />
              )}
            </div>
          );
        })}
      </div>

      {orderedKeys.length > 7 && (
        <button
          className="group-toggle-button"
          type="button"
          onClick={() => onToggle(mealId, groupName)}
        >
          {isExpanded ? "See Less" : "See More"}
        </button>
      )}
    </section>
  );
}

export default NutrientGroup;
