type DailySummaryProps = {
  day: any;
  getNutrientDisplayName: (nutrientKey: string) => string;
  formatNumber: (value: number | string) => number;
  onBack?: () => void;
};

function DailySummary({
  day,
  getNutrientDisplayName,
  formatNumber,
  onBack,
}: DailySummaryProps) {
  return (
    <div>
      <h2>Daily Summary</h2>

      <p>Summary based on your recorded food entries.</p>

      {day.nutritionStatus
        ?.filter((nutrient: any) => Number(nutrient.consumed) > 0)
        .map((nutrient: any) => (
          <p key={nutrient.nutrientKey}>
            {getNutrientDisplayName(nutrient.nutrientKey)}:{" "}
            {formatNumber(nutrient.consumed)} {nutrient.unit}
          </p>
        ))}

      {onBack && (
        <button type="button" onClick={onBack}>
          Back
        </button>
      )}
    </div>
  );
}

export default DailySummary;
