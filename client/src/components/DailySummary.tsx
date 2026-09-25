import "./DailySummary.css";

type DailySummaryProps = {
  day: any;
  getNutrientDisplayName: (nutrientKey: string) => string;
  formatNumber: (value: any) => any;
  onBack: () => void;
};

function DailySummary({
  day,
  getNutrientDisplayName,
  formatNumber,
  onBack,
}: DailySummaryProps) {
  const nutrients = Array.isArray(day?.nutritionStatus)
    ? day.nutritionStatus
    : [];

  const sessionDate = day?.day?.session_date
    ? String(day.day.session_date).slice(0, 10)
    : null;

  return (
    <section className="daily-summary-page">
      <div className="daily-summary-main">
        <div className="daily-summary-header">
          <h2>Daily Summary</h2>

          <div className="daily-summary-header-actions">
            {sessionDate && (
              <span className="daily-summary-date">{sessionDate}</span>
            )}

            <button
              className="daily-summary-back"
              type="button"
              onClick={onBack}
            >
              Back
            </button>
          </div>
        </div>

        <div className="daily-summary-grid">
          {nutrients.map((nutrient: any) => (
            <div className="daily-summary-item" key={nutrient.nutrientKey}>
              <span className="daily-summary-name">
                {getNutrientDisplayName(nutrient.nutrientKey)}
              </span>

              <span className="daily-summary-value">
                {formatNumber(nutrient.consumed)} {nutrient.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      <aside className="daily-summary-message" aria-label="End of day message">
        <div className="daily-summary-message-inner">
          <p className="daily-summary-message-main">
            Enjoy the rest of your day.
          </p>
          <p className="daily-summary-message-sub">
            Your nutrition is logged for today.
          </p>
        </div>
      </aside>
    </section>
  );
}

export default DailySummary;
