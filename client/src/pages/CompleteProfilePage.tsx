import "./CompleteProfilePage.css";

type CompleteProfilePageProps = {
  age: string;
  sex: string;
  height: string;
  weight: string;
  activity: string;
  message: string;
  onAgeChange: (value: string) => void;
  onSexChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onActivityChange: (value: string) => void;
  onClearMessage: () => void;
  onSkip: () => void;
  onFinish: () => void;
};

const activityOptions = [
  {
    value: "inactive",
    title: "Inactive",
    description: "Daily living, light walking, and light household activity.",
  },
  {
    value: "lowActive",
    title: "Low active",
    description: "Daily living plus regular walking or similar light activity.",
  },
  {
    value: "active",
    title: "Active",
    description: "Daily living plus moderate exercise, cycling, or sports.",
  },
  {
    value: "veryActive",
    title: "Very active",
    description:
      "Daily living plus substantial exercise or recreational sports.",
  },
];

function CompleteProfilePage({
  age,
  sex,
  height,
  weight,
  activity,
  message,
  onAgeChange,
  onSexChange,
  onHeightChange,
  onWeightChange,
  onActivityChange,
  onClearMessage,
  onSkip,
  onFinish,
}: CompleteProfilePageProps) {
  function updateField(callback: (value: string) => void, value: string) {
    callback(value);

    if (message) {
      onClearMessage();
    }
  }

  return (
    <main className="complete-profile-page">
      <section className="complete-profile-card">
        <header className="complete-profile-header">
          <h1>Complete your profile</h1>
          <p>
            Add a few details to calculate your personalized daily nutrition
            targets.
          </p>
        </header>

        <div className="complete-profile-fields">
          <label className="complete-profile-field">
            <span>Age</span>
            <input
              type="number"
              min={1}
              max={120}
              step={1}
              value={age}
              placeholder="Age"
              onChange={(event) => updateField(onAgeChange, event.target.value)}
            />
          </label>

          <label className="complete-profile-field">
            <span>Sex</span>
            <select
              value={sex}
              onChange={(event) => updateField(onSexChange, event.target.value)}
            >
              <option value="">Select sex</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </label>

          <label className="complete-profile-field">
            <span>Height</span>
            <div className="complete-profile-input-unit">
              <input
                type="number"
                min={40}
                max={250}
                step={0.1}
                value={height}
                placeholder="Height"
                onChange={(event) =>
                  updateField(onHeightChange, event.target.value)
                }
              />
              <span>cm</span>
            </div>
          </label>

          <label className="complete-profile-field">
            <span>Weight</span>
            <div className="complete-profile-input-unit">
              <input
                type="number"
                min={2}
                max={300}
                step={0.1}
                value={weight}
                placeholder="Weight"
                onChange={(event) =>
                  updateField(onWeightChange, event.target.value)
                }
              />
              <span>kg</span>
            </div>
          </label>
        </div>

        <section className="complete-profile-activity">
          <div className="complete-profile-section-heading">
            <h2>Activity Level</h2>
            <p>Choose the closest match to your usual daily activity.</p>
          </div>

          <div className="complete-profile-activity-grid">
            {activityOptions.map((option) => (
              <label
                className={`complete-profile-activity-option ${
                  activity === option.value ? "is-selected" : ""
                }`}
                key={option.value}
              >
                <input
                  type="radio"
                  name="activityLevel"
                  value={option.value}
                  checked={activity === option.value}
                  onChange={(event) =>
                    updateField(onActivityChange, event.target.value)
                  }
                />

                <span>
                  <strong>{option.title}</strong>
                  <small>{option.description}</small>
                </span>
              </label>
            ))}
          </div>
        </section>

        {message && (
          <p className="complete-profile-error" role="alert">
            {message}
          </p>
        )}

        <div className="complete-profile-actions">
          <button
            className="complete-profile-button complete-profile-button-secondary"
            type="button"
            onClick={onSkip}
          >
            Skip for now
          </button>

          <button
            className="complete-profile-button complete-profile-button-primary"
            type="button"
            onClick={onFinish}
          >
            Finish
          </button>
        </div>
      </section>
    </main>
  );
}

export default CompleteProfilePage;
