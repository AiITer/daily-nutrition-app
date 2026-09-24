import MealCard from "../components/MealCard";
import FoodSuggestions from "../components/FoodSuggestions";
import NutrientGroup from "../components/NutrientGroup";
import DailySummary from "../components/DailySummary";

type HomePageProps = {
  activeDayId: number | null;
  canStartNewDay: boolean;
  nowDayId: number | null;
  previousDayId: number | null;

  mealSessions: any[];
  mealDetails: Record<number, any>;

  addingMealId: number | null;
  foodName: string;
  foodAmount: string;
  foodUnit: string;
  foodMessage: string;

  expandedRemainingMealId: number | null;
  expandedRecommendation: {
    mealId: number;
    nutrientKey: string;
    section: "nutrition" | "remaining";
  } | null;

  recommendations: any[];
  showAllRecommendations: boolean;
  expandedNutrientGroups: Record<string, boolean>;

  selectedDay: any;
  historyTab: "foods" | "nutrition" | null;

  macronutrientPriority: string[];
  vitaminPriority: string[];
  mineralPriority: string[];
  recommendationNutrientKeys: string[];

  setAddingMealId: (value: number | null) => void;
  setFoodName: (value: string) => void;
  setFoodAmount: (value: string) => void;
  setFoodUnit: (value: string) => void;

  setExpandedRemainingMealId: (value: number | null) => void;
  setExpandedRecommendation: (value: any) => void;
  setRecommendations: (value: any[]) => void;
  setShowAllRecommendations: (value: boolean) => void;

  setHistoryTab: (value: "foods" | "nutrition" | null) => void;
  setSelectedDay: (value: any) => void;

  onStartNewDay: () => void;
  onNewMeal: () => void;
  onDeleteMeal: (mealId: number) => void;
  onDeleteFood: (foodId: number, mealId: number) => void;
  onAddFood: (mealId: number) => void;
  onCancelAddFood: () => void;
  onFinishDay: () => void;
  onLoadDayDetails: (dayId: number) => void;

  onLoadRecommendations: (
    mealId: number,
    nutrientKey: string,
    section: "nutrition" | "remaining",
  ) => void;

  onToggleNutrientGroup: (
    mealId: number,
    group: "macronutrients" | "vitamins" | "minerals",
  ) => void;

  getDailyNeedText: (status: any) => string | null;
  getNutrientDisplayName: (nutrientKey: string) => string;
  formatNumber: (value: number | string) => number;
};
function HomePage({
  activeDayId,
  canStartNewDay,
  nowDayId,
  previousDayId,

  mealSessions,
  mealDetails,

  addingMealId,
  foodName,
  foodAmount,
  foodUnit,
  foodMessage,

  expandedRemainingMealId,
  expandedRecommendation,
  recommendations,
  showAllRecommendations,
  expandedNutrientGroups,

  selectedDay,
  historyTab,

  macronutrientPriority,
  vitaminPriority,
  mineralPriority,
  recommendationNutrientKeys,

  setAddingMealId,
  setFoodName,
  setFoodAmount,
  setFoodUnit,

  setExpandedRemainingMealId,
  setExpandedRecommendation,
  setRecommendations,
  setShowAllRecommendations,

  setHistoryTab,
  setSelectedDay,

  onStartNewDay,
  onNewMeal,
  onDeleteMeal,
  onDeleteFood,
  onAddFood,
  onCancelAddFood,
  onFinishDay,
  onLoadDayDetails,
  onLoadRecommendations,
  onToggleNutrientGroup,

  getDailyNeedText,
  getNutrientDisplayName,
  formatNumber,
}: HomePageProps) {
  return (
    <div>
      {
        <button onClick={onStartNewDay} disabled={!canStartNewDay}>
          Start New Day
        </button>
      }

      {activeDayId !== null && (
        <div>
          <button onClick={onNewMeal}>New Meal</button>
          {mealSessions.map((meal, index) => (
            <MealCard
              key={meal.id}
              meal={meal}
              mealNumber={index + 1}
              onDeleteMeal={onDeleteMeal}
            >
              {mealDetails[meal.id]?.foods?.map((food: any) => (
                <div key={food.id}>
                  <span>
                    {food.food_name} — {food.amount} {food.unit}
                  </span>

                  <button
                    type="button"
                    onClick={() => onDeleteFood(food.id, meal.id)}
                  >
                    Delete Food
                  </button>
                </div>
              ))}
              {mealDetails[meal.id]?.nutrition?.length > 0 && (
                <div>
                  <h4>Meal Nutrition</h4>

                  {mealDetails[meal.id]?.nutrition
                    ?.filter(
                      (nutrient: any) => nutrient.nutrientKey === "energy",
                    )
                    .map((nutrient: any) => {
                      const status = mealDetails[
                        meal.id
                      ]?.nutritionStatusThroughMeal?.find(
                        (item: any) => item.nutrientKey === "energy",
                      );

                      return (
                        <div key={nutrient.nutrientKey}>
                          <strong>Energy</strong>

                          <p>
                            Consumed: {formatNumber(nutrient.amount)}{" "}
                            {nutrient.unit}
                          </p>

                          {getDailyNeedText(status) && (
                            <p>Daily Need: {getDailyNeedText(status)}</p>
                          )}

                          <FoodSuggestions
                            mealId={meal.id}
                            nutrientKey="energy"
                            section="nutrition"
                            expandedRecommendation={expandedRecommendation}
                            recommendations={recommendations}
                            showAllRecommendations={showAllRecommendations}
                            onLoadRecommendations={onLoadRecommendations}
                            setShowAllRecommendations={
                              setShowAllRecommendations
                            }
                            formatNumber={formatNumber}
                          />
                        </div>
                      );
                    })}

                  <div>
                    <NutrientGroup
                      title="Macronutrients"
                      groupName="macronutrients"
                      nutrientKeys={macronutrientPriority}
                      mealId={meal.id}
                      nutrition={mealDetails[meal.id]?.nutrition ?? []}
                      nutritionStatus={
                        mealDetails[meal.id]?.nutritionStatusThroughMeal ?? []
                      }
                      isExpanded={
                        expandedNutrientGroups[`${meal.id}-macronutrients`] ??
                        false
                      }
                      recommendationNutrientKeys={recommendationNutrientKeys}
                      expandedRecommendation={expandedRecommendation}
                      recommendations={recommendations}
                      showAllRecommendations={showAllRecommendations}
                      onToggle={onToggleNutrientGroup}
                      onLoadRecommendations={onLoadRecommendations}
                      setShowAllRecommendations={setShowAllRecommendations}
                      getDailyNeedText={getDailyNeedText}
                      getNutrientDisplayName={getNutrientDisplayName}
                      formatNumber={formatNumber}
                    />
                  </div>
                  <div>
                    <NutrientGroup
                      title="Vitamins"
                      groupName="vitamins"
                      nutrientKeys={vitaminPriority}
                      mealId={meal.id}
                      nutrition={mealDetails[meal.id]?.nutrition ?? []}
                      nutritionStatus={
                        mealDetails[meal.id]?.nutritionStatusThroughMeal ?? []
                      }
                      isExpanded={
                        expandedNutrientGroups[`${meal.id}-vitamins`] ?? false
                      }
                      recommendationNutrientKeys={recommendationNutrientKeys}
                      expandedRecommendation={expandedRecommendation}
                      recommendations={recommendations}
                      showAllRecommendations={showAllRecommendations}
                      onToggle={onToggleNutrientGroup}
                      onLoadRecommendations={onLoadRecommendations}
                      setShowAllRecommendations={setShowAllRecommendations}
                      getDailyNeedText={getDailyNeedText}
                      getNutrientDisplayName={getNutrientDisplayName}
                      formatNumber={formatNumber}
                    />
                  </div>
                  <div>
                    <NutrientGroup
                      title="Minerals"
                      groupName="minerals"
                      nutrientKeys={mineralPriority}
                      mealId={meal.id}
                      nutrition={mealDetails[meal.id]?.nutrition ?? []}
                      nutritionStatus={
                        mealDetails[meal.id]?.nutritionStatusThroughMeal ?? []
                      }
                      isExpanded={
                        expandedNutrientGroups[`${meal.id}-minerals`] ?? false
                      }
                      recommendationNutrientKeys={recommendationNutrientKeys}
                      expandedRecommendation={expandedRecommendation}
                      recommendations={recommendations}
                      showAllRecommendations={showAllRecommendations}
                      onToggle={onToggleNutrientGroup}
                      onLoadRecommendations={onLoadRecommendations}
                      setShowAllRecommendations={setShowAllRecommendations}
                      getDailyNeedText={getDailyNeedText}
                      getNutrientDisplayName={getNutrientDisplayName}
                      formatNumber={formatNumber}
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setExpandedRemainingMealId(
                    expandedRemainingMealId === meal.id ? null : meal.id,
                  );

                  setExpandedRecommendation(null);
                  setRecommendations([]);
                  setShowAllRecommendations(false);
                }}
              >
                {expandedRemainingMealId === meal.id
                  ? "Hide Daily Remaining"
                  : "View Daily Remaining"}
              </button>

              {expandedRemainingMealId === meal.id &&
                mealDetails[meal.id]?.nutritionStatusThroughMeal?.length >
                  0 && (
                  <div>
                    <h4>Daily Remaining After This Meal</h4>

                    {mealDetails[meal.id].nutritionStatusThroughMeal
                      .filter(
                        (nutrient: any) => nutrient.targetType !== "monitor",
                      )
                      .map((nutrient: any) => (
                        <div key={nutrient.nutrientKey}>
                          <strong>
                            {getNutrientDisplayName(nutrient.nutrientKey)}
                          </strong>

                          {nutrient.targetType === "target" && (
                            <p>
                              {nutrient.remaining > 0
                                ? `Remaining: ${formatNumber(
                                    nutrient.remaining,
                                  )} ${nutrient.unit}`
                                : "Daily target reached"}
                            </p>
                          )}

                          {nutrient.targetType === "range" &&
                            nutrient.status === "below" && (
                              <p>
                                Remaining to recommended range:{" "}
                                {formatNumber(nutrient.remainingToMin)}{" "}
                                {nutrient.unit}
                              </p>
                            )}

                          {nutrient.targetType === "range" &&
                            nutrient.status === "within" && (
                              <p>Within recommended range</p>
                            )}

                          {nutrient.targetType === "range" &&
                            nutrient.status === "above" && (
                              <p>
                                Above recommended range by{" "}
                                {formatNumber(nutrient.amountAboveMax)}{" "}
                                {nutrient.unit}
                              </p>
                            )}

                          {recommendationNutrientKeys.includes(
                            nutrient.nutrientKey,
                          ) && (
                            <FoodSuggestions
                              mealId={meal.id}
                              nutrientKey={nutrient.nutrientKey}
                              section="remaining"
                              expandedRecommendation={expandedRecommendation}
                              recommendations={recommendations}
                              showAllRecommendations={showAllRecommendations}
                              onLoadRecommendations={onLoadRecommendations}
                              setShowAllRecommendations={
                                setShowAllRecommendations
                              }
                              formatNumber={formatNumber}
                            />
                          )}
                        </div>
                      ))}
                  </div>
                )}

              {addingMealId === meal.id ? (
                <div>
                  <input
                    type="text"
                    placeholder="Food"
                    value={foodName}
                    onChange={(event) => setFoodName(event.target.value)}
                  />

                  <input
                    type="number"
                    placeholder="Amount"
                    value={foodAmount}
                    onChange={(event) => setFoodAmount(event.target.value)}
                  />

                  <select
                    value={foodUnit}
                    onChange={(event) => setFoodUnit(event.target.value)}
                  >
                    <option value="g">g</option>
                    <option value="mL">mL</option>
                    <option value="L">L</option>
                    <option value="tsp">tsp</option>
                  </select>

                  <button onClick={() => onAddFood(meal.id)}>Save Food</button>

                  <button type="button" onClick={onCancelAddFood}>
                    Cancel
                  </button>
                  {foodMessage && <p>{foodMessage}</p>}
                </div>
              ) : (
                <button onClick={() => setAddingMealId(meal.id)}>
                  Add Food
                </button>
              )}
            </MealCard>
          ))}
        </div>
      )}

      {activeDayId !== null && (
        <button onClick={onFinishDay}>Finish the Day</button>
      )}
      {activeDayId === null && nowDayId !== null && (
        <button
          onClick={() => {
            setHistoryTab(null);
            onLoadDayDetails(nowDayId);
          }}
        >
          View Today's Summary
        </button>
      )}
      {activeDayId === null && nowDayId === null && previousDayId !== null && (
        <button
          onClick={() => {
            setHistoryTab(null);
            onLoadDayDetails(previousDayId);
          }}
        >
          View Previous Day Summary
        </button>
      )}
      {selectedDay && historyTab === null && (
        <DailySummary
          day={selectedDay}
          getNutrientDisplayName={getNutrientDisplayName}
          formatNumber={formatNumber}
          onBack={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}

export default HomePage;
