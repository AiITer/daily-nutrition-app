type FoodSuggestionsProps = {
  mealId: number;
  nutrientKey: string;
  section: "nutrition" | "remaining";

  expandedRecommendation: {
    mealId: number;
    nutrientKey: string;
    section: "nutrition" | "remaining";
  } | null;

  recommendations: any[];
  showAllRecommendations: boolean;

  onLoadRecommendations: (
    mealId: number,
    nutrientKey: string,
    section: "nutrition" | "remaining",
  ) => void;

  setShowAllRecommendations: (value: boolean) => void;
  formatNumber: (value: number | string) => number;
};

function FoodSuggestions({
  mealId,
  nutrientKey,
  section,
  expandedRecommendation,
  recommendations,
  showAllRecommendations,
  onLoadRecommendations,
  setShowAllRecommendations,
  formatNumber,
}: FoodSuggestionsProps) {
  const isExpanded =
    expandedRecommendation?.mealId === mealId &&
    expandedRecommendation?.nutrientKey === nutrientKey &&
    expandedRecommendation?.section === section;

  return (
    <div>
      <button
        type="button"
        onClick={() => onLoadRecommendations(mealId, nutrientKey, section)}
      >
        Food Suggestions
      </button>

      {isExpanded && (
        <div>
          {recommendations
            .slice(0, showAllRecommendations ? 5 : 3)
            .map((recommendation: any) => (
              <div key={recommendation.foodId}>
                {recommendation.displayName} —{" "}
                {formatNumber(recommendation.nutrientAmountPer100Units)}{" "}
                {recommendation.unit} per 100 {recommendation.basisUnit}
              </div>
            ))}

          {recommendations.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllRecommendations(!showAllRecommendations)}
            >
              {showAllRecommendations ? "Less" : "More"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default FoodSuggestions;
