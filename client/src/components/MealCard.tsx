type MealCardProps = {
  meal: any;
  mealNumber: number;
  children: React.ReactNode;
  onDeleteMeal: (mealId: number) => void;
};

function MealCard({ meal, mealNumber, children, onDeleteMeal }: MealCardProps) {
  return (
    <div>
      <h3>Meal {mealNumber}</h3>

      <button type="button" onClick={() => onDeleteMeal(meal.id)}>
        Delete Meal
      </button>

      {children}
    </div>
  );
}

export default MealCard;
