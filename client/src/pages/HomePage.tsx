import { Link } from "react-router-dom";
import "./HomePage.css";
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

function isBelowTenPercent(status: any) {
  if (!status || status.targetType === "monitor") {
    return false;
  }

  const consumed = Number(status.consumed ?? 0);

  if (status.targetType === "target") {
    const target = Number(status.target);
    return Number.isFinite(target) && target > 0 && consumed < target * 0.1;
  }

  if (status.targetType === "range") {
    const minimum = Number(status.minTarget);
    return Number.isFinite(minimum) && minimum > 0 && consumed < minimum * 0.1;
  }

  return false;
}

function isTargetMet(status: any) {
  if (!status || status.targetType === "monitor") {
    return false;
  }

  if (status.targetType === "target") {
    const remaining = Number(status.remaining);
    return Number.isFinite(remaining) && remaining <= 0;
  }

  if (status.targetType === "range") {
    return status.status === "within";
  }

  return false;
}

function needsMoreNutrition(status: any) {
  if (!status || status.targetType === "monitor") {
    return false;
  }

  if (status.targetType === "target") {
    return Number(status.remaining) > 0;
  }

  if (status.targetType === "range") {
    return status.status === "below";
  }

  return false;
}

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
  const hasMeals = Array.isArray(mealSessions) && mealSessions.length > 0;

  return (
    <div className={`home-page ${hasMeals ? "has-meals" : "no-meals"}`}>
      {activeDayId !== null && hasMeals && (
        <div className="home-toolbar">
          <button onClick={onNewMeal}>New Meal</button>
        </div>
      )}

      {activeDayId === null && canStartNewDay && !selectedDay && (
        <section className="home-empty-state">
          <div className="home-empty-content">
            <p className="home-empty-eyebrow">
              Your daily nutrition starts here
            </p>

            <h1>Start your nutrition day</h1>

            <p className="home-empty-description">
              Start a new day, log a meal, and add what you eat to see your
              nutrition and what your day still needs.
            </p>

            <button
              className="home-empty-primary"
              type="button"
              onClick={onStartNewDay}
            >
              Start New Day
            </button>

            <div className="home-empty-steps" aria-label="How it works">
              <span>Start a day</span>
              <span>Log a meal</span>
              <span>Add food</span>
              <span>Monitor your nutrition</span>
            </div>
          </div>
        </section>
      )}

      {activeDayId !== null && !hasMeals && (
        <section className="home-empty-state home-empty-state-meal">
          <div className="home-empty-content">
            <p className="home-empty-eyebrow">Day started</p>

            <h1>Log your first meal</h1>

            <p className="home-empty-description">
              Log a meal, then add food to see its nutrition and your daily
              remaining targets.
            </p>

            <button
              className="home-empty-primary"
              type="button"
              onClick={onNewMeal}
            >
              + Log Meal
            </button>
          </div>
        </section>
      )}

      {activeDayId !== null && hasMeals && (
        <div className="active-day">
          <div className="meal-list">
            {mealSessions.map((meal, index) => (
              <MealCard
                key={meal.id}
                meal={meal}
                mealNumber={index + 1}
                onDeleteMeal={onDeleteMeal}
              >
                <div className="meal-food-section">
                  {mealDetails[meal.id]?.foods?.length > 0 && (
                    <div className="food-entry-list">
                      {mealDetails[meal.id].foods.map((food: any) => (
                        <div className="food-entry-row" key={food.id}>
                          <span>
                            {food.food_name} — {food.amount} {food.unit}
                          </span>

                          <button
                            className="quiet-button delete-food-button"
                            type="button"
                            onClick={() => onDeleteFood(food.id, meal.id)}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {addingMealId === meal.id ? (
                    <div className="food-form">
                      <input
                        type="text"
                        placeholder="Food"
                        value={foodName}
                        onChange={(event) => setFoodName(event.target.value)}
                      />

                      <input
                        type="number"
                        placeholder="Amount"
                        min="0.01"
                        step="any"
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

                      <button
                        className="nutrition-button"
                        disabled={
                          !foodName.trim() ||
                          !Number.isFinite(Number(foodAmount)) ||
                          Number(foodAmount) <= 0
                        }
                        onClick={() => onAddFood(meal.id)}
                      >
                        Save Food
                      </button>

                      <button
                        className="quiet-button"
                        type="button"
                        onClick={onCancelAddFood}
                      >
                        Cancel
                      </button>

                      {foodMessage && (
                        <p className="food-message">
                          {foodMessage}
                          {foodMessage
                            .toLowerCase()
                            .includes("complete your profile") && (
                            <>
                              {" "}
                              <Link
                                className="complete-profile-link"
                                to="/dashboard"
                              >
                                Go to Dashboard
                              </Link>
                            </>
                          )}
                        </p>
                      )}
                    </div>
                  ) : (
                    <button
                      className="nutrition-button add-food-button"
                      onClick={() => setAddingMealId(meal.id)}
                    >
                      + Add Food
                    </button>
                  )}
                </div>

                {mealDetails[meal.id]?.nutrition?.length > 0 && (
                  <section className="meal-nutrition">
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
                          <div
                            className="energy-summary"
                            key={nutrient.nutrientKey}
                          >
                            <strong>Energy</strong>

                            <span className="nutrient-value">
                              Consumed&nbsp;&nbsp;
                              {formatNumber(nutrient.amount)} {nutrient.unit}
                            </span>

                            <span>
                              Daily Need&nbsp;&nbsp;
                              {getDailyNeedText(status) ?? "—"}
                            </span>

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

                    <div className="nutrition-grid">
                      <div className="nutrition-column">
                        <NutrientGroup
                          title="Macronutrients"
                          groupName="macronutrients"
                          nutrientKeys={macronutrientPriority}
                          mealId={meal.id}
                          nutrition={mealDetails[meal.id]?.nutrition ?? []}
                          nutritionStatus={
                            mealDetails[meal.id]?.nutritionStatusThroughMeal ??
                            []
                          }
                          isExpanded={
                            expandedNutrientGroups[
                              `${meal.id}-macronutrients`
                            ] ?? false
                          }
                          recommendationNutrientKeys={
                            recommendationNutrientKeys
                          }
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

                      <div className="nutrition-column">
                        <NutrientGroup
                          title="Vitamins"
                          groupName="vitamins"
                          nutrientKeys={vitaminPriority}
                          mealId={meal.id}
                          nutrition={mealDetails[meal.id]?.nutrition ?? []}
                          nutritionStatus={
                            mealDetails[meal.id]?.nutritionStatusThroughMeal ??
                            []
                          }
                          isExpanded={
                            expandedNutrientGroups[`${meal.id}-vitamins`] ??
                            false
                          }
                          recommendationNutrientKeys={
                            recommendationNutrientKeys
                          }
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

                      <div className="nutrition-column">
                        <NutrientGroup
                          title="Minerals"
                          groupName="minerals"
                          nutrientKeys={mineralPriority}
                          mealId={meal.id}
                          nutrition={mealDetails[meal.id]?.nutrition ?? []}
                          nutritionStatus={
                            mealDetails[meal.id]?.nutritionStatusThroughMeal ??
                            []
                          }
                          isExpanded={
                            expandedNutrientGroups[`${meal.id}-minerals`] ??
                            false
                          }
                          recommendationNutrientKeys={
                            recommendationNutrientKeys
                          }
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
                  </section>
                )}

                <div className="remaining-toggle-row">
                  <button
                    className="nutrition-button"
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
                </div>

                {expandedRemainingMealId === meal.id &&
                  mealDetails[meal.id]?.nutritionStatusThroughMeal?.length >
                    0 && (
                    <section className="remaining-panel">
                      <h4>Daily Remaining After This Meal</h4>

                      <div className="remaining-grid">
                        {mealDetails[meal.id].nutritionStatusThroughMeal
                          .filter(
                            (nutrient: any) =>
                              nutrient.targetType !== "monitor",
                          )
                          .map((nutrient: any) => {
                            const targetMet = isTargetMet(nutrient);
                            const lowIntake =
                              !targetMet && isBelowTenPercent(nutrient);
                            const showSuggestions =
                              needsMoreNutrition(nutrient) &&
                              recommendationNutrientKeys.includes(
                                nutrient.nutrientKey,
                              );

                            return (
                              <div
                                className="remaining-item"
                                key={nutrient.nutrientKey}
                              >
                                <strong
                                  className={
                                    targetMet ? "met-remaining-name" : undefined
                                  }
                                >
                                  {getNutrientDisplayName(nutrient.nutrientKey)}
                                </strong>

                                <span
                                  className={
                                    lowIntake
                                      ? "remaining-value low-remaining-value"
                                      : "remaining-value"
                                  }
                                >
                                  {nutrient.targetType === "target" &&
                                    `${formatNumber(
                                      Math.max(
                                        Number(nutrient.remaining ?? 0),
                                        0,
                                      ),
                                    )} ${nutrient.unit}`}

                                  {nutrient.targetType === "range" &&
                                    nutrient.status === "below" &&
                                    `${formatNumber(
                                      nutrient.remainingToMin,
                                    )} ${nutrient.unit}`}

                                  {nutrient.targetType === "range" &&
                                    nutrient.status === "within" &&
                                    "Within range"}

                                  {nutrient.targetType === "range" &&
                                    nutrient.status === "above" &&
                                    `+${formatNumber(
                                      nutrient.amountAboveMax,
                                    )} ${nutrient.unit}`}
                                </span>

                                {showSuggestions && (
                                  <FoodSuggestions
                                    mealId={meal.id}
                                    nutrientKey={nutrient.nutrientKey}
                                    section="remaining"
                                    expandedRecommendation={
                                      expandedRecommendation
                                    }
                                    recommendations={recommendations}
                                    showAllRecommendations={
                                      showAllRecommendations
                                    }
                                    onLoadRecommendations={
                                      onLoadRecommendations
                                    }
                                    setShowAllRecommendations={
                                      setShowAllRecommendations
                                    }
                                    formatNumber={formatNumber}
                                  />
                                )}
                              </div>
                            );
                          })}
                      </div>

                      <p className="remaining-legend">
                        <span>
                          <span className="legend-dot legend-dot-blue" />
                          Target met
                        </span>

                        <span>
                          <span className="legend-dot legend-dot-red" />
                          Less than 10% consumed
                        </span>
                      </p>
                    </section>
                  )}
              </MealCard>
            ))}
          </div>

          {hasMeals && (
            <div className="finish-day-row">
              <button type="button" onClick={onNewMeal}>
                + Add Another Meal
              </button>

              <button type="button" onClick={onFinishDay}>
                Finish the Day
              </button>
            </div>
          )}
        </div>
      )}

      {activeDayId === null && nowDayId !== null && !selectedDay && (
        <section className="finished-day-state">
          <button
            className="finished-day-summary-button"
            onClick={() => {
              setHistoryTab(null);
              onLoadDayDetails(nowDayId);
            }}
          >
            View Today's Summary
          </button>

          <div className="finished-day-message">
            <p className="finished-day-message-main">
              Enjoy the rest of your day.
            </p>
            <p className="finished-day-message-sub">
              Your nutrition is logged for today.
            </p>
          </div>
        </section>
      )}

      {activeDayId === null &&
        nowDayId === null &&
        previousDayId !== null &&
        !selectedDay && (
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
          showEndOfDayMessage={
            nowDayId !== null &&
            Number(selectedDay?.day?.id) === Number(nowDayId)
          }
          onBack={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}

export default HomePage;
