type MealCardProps = {
  meal: any;
  mealNumber: number;
  children: React.ReactNode;
  onDeleteMeal: (mealId: number) => void;
};

function MealCard({ meal, mealNumber, children, onDeleteMeal }: MealCardProps) {
  return (
    <section className="meal-card">
      <div className="meal-card-header">
        <h3>Meal {mealNumber}</h3>

        <button
          className="quiet-button delete-meal-button"
          type="button"
          onClick={() => onDeleteMeal(meal.id)}
        >
          Delete Meal
        </button>
      </div>

      {children}
    </section>
  );
}

export default MealCard;
