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
  const isOpen =
    expandedRecommendation?.mealId === mealId &&
    expandedRecommendation?.nutrientKey === nutrientKey &&
    expandedRecommendation?.section === section;

  const visibleRecommendations = recommendations.slice(
    0,
    showAllRecommendations ? 5 : 3,
  );

  return (
    <div className="suggestions-control">
      <button
        className="suggestions-button"
        type="button"
        onClick={() => onLoadRecommendations(mealId, nutrientKey, section)}
      >
        Food Suggestions
      </button>

      {isOpen && (
        <div className="suggestions-panel">
          {visibleRecommendations.map((recommendation: any, index: number) => (
            <div
              className="suggestion-row"
              key={recommendation.foodId ?? recommendation.displayName}
            >
              <div className="suggestion-item">
                <strong>{recommendation.displayName}</strong>
                <span>
                  {formatNumber(recommendation.nutrientAmountPer100Units)}{" "}
                  {recommendation.unit} per 100 {recommendation.basisUnit}
                </span>
              </div>

              {index === visibleRecommendations.length - 1 &&
                recommendations.length > 3 && (
                  <button
                    className="suggestions-more-button"
                    type="button"
                    onClick={() =>
                      setShowAllRecommendations(!showAllRecommendations)
                    }
                  >
                    {showAllRecommendations ? "Less" : "More"}
                  </button>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FoodSuggestions;
