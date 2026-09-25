import "./HistoryDailySummary.css";

type HistoryDailySummaryProps = {
  day: any;
  getNutrientDisplayName: (nutrientKey: string) => string;
  formatNumber: (value: any) => any;
  onBack: () => void;
};

function HistoryDailySummary({
  day,
  getNutrientDisplayName,
  formatNumber,
  onBack,
}: HistoryDailySummaryProps) {
  const nutrients = Array.isArray(day?.nutritionStatus)
    ? day.nutritionStatus
    : [];

  const sessionDate = day?.day?.session_date
    ? String(day.day.session_date).slice(0, 10)
    : null;

  return (
    <section className="history-daily-summary">
      <div className="history-daily-summary-header">
        <h3>Daily Summary</h3>

        <div className="history-daily-summary-actions">
          {sessionDate && (
            <span className="history-daily-summary-date">{sessionDate}</span>
          )}

          <button type="button" onClick={onBack}>
            Back
          </button>
        </div>
      </div>

      <div className="history-daily-summary-grid">
        {nutrients.map((nutrient: any) => (
          <div
            className="history-daily-summary-item"
            key={nutrient.nutrientKey}
          >
            <strong>{getNutrientDisplayName(nutrient.nutrientKey)}</strong>

            <span>
              {formatNumber(nutrient.consumed)} {nutrient.unit}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HistoryDailySummary;
