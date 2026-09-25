import HistoryDailySummary from "../components/HistoryDailySummary";
import { useState } from "react";

type DashboardPageProps = {
  accountEmail: string;
  profile: any;
  days: any[];
  foodHistory: any[];
  historyTab: "foods" | "nutrition" | null;
  selectedDay: any;

  profileAge: string;
  profileSex: string;
  profileHeight: string;
  profileWeight: string;
  profileActivity: string;
  isEditingProfile: boolean;
  profileMessage: string;

  setProfileAge: (value: string) => void;
  setProfileSex: (value: string) => void;
  setProfileHeight: (value: string) => void;
  setProfileWeight: (value: string) => void;
  setProfileActivity: (value: string) => void;
  setIsEditingProfile: (value: boolean) => void;
  setProfileMessage: (value: string) => void;

  setHistoryTab: (value: "foods" | "nutrition" | null) => void;
  setSelectedDay: (value: any) => void;

  onUpdateProfile: () => void;
  onLoadDayDetails: (dayId: number) => void;
  onCompleteProfile: () => void;

  getNutrientDisplayName: (nutrientKey: string) => string;
  formatNumber: (value: number | string) => number;
};

function DashboardPage({
  accountEmail,
  profile,
  days,
  foodHistory,
  historyTab,
  selectedDay,

  profileAge,
  profileSex,
  profileHeight,
  profileWeight,
  profileActivity,
  isEditingProfile,
  profileMessage,

  setProfileAge,
  setProfileSex,
  setProfileHeight,
  setProfileWeight,
  setProfileActivity,
  setIsEditingProfile,
  setProfileMessage,

  setHistoryTab,
  setSelectedDay,

  onUpdateProfile,
  onLoadDayDetails,
  onCompleteProfile,

  getNutrientDisplayName,
  formatNumber,
}: DashboardPageProps) {
  const today = new Date();

  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [showNutritionHistory, setShowNutritionHistory] = useState(false);
  const [showFoodHistory, setShowFoodHistory] = useState(false);

  const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

  const calendarDays = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const historyDayByDate = new Map(
    days.map((day) => [day.session_date.slice(0, 10), day]),
  );

  const calendarMonthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(calendarYear, calendarMonth, 1));

  const selectedDateKey = selectedDay?.day?.session_date?.slice(0, 10);

  function changeCalendarMonth(offset: number) {
    const nextMonth = new Date(calendarYear, calendarMonth + offset, 1);

    setCalendarYear(nextMonth.getFullYear());
    setCalendarMonth(nextMonth.getMonth());
  }

  function startEditingProfile() {
    setProfileMessage("");
    setProfileAge(String(profile.age));
    setProfileSex(profile.sex);
    setProfileHeight(String(profile.height_cm));
    setProfileWeight(String(profile.weight_kg));
    setProfileActivity(profile.activity_level);
    setIsEditingProfile(true);
  }

  function cancelEditingProfile() {
    setProfileMessage("");

    if (profile) {
      setProfileAge(String(profile.age));
      setProfileSex(profile.sex);
      setProfileHeight(String(profile.height_cm));
      setProfileWeight(String(profile.weight_kg));
      setProfileActivity(profile.activity_level);
    }

    setIsEditingProfile(false);
  }

  function getAccountDisplayName() {
    const emailName = accountEmail.split("@")[0].trim();

    if (!emailName || /^\d+$/.test(emailName)) {
      return "there";
    }

    const words = emailName
      .replace(/[._-]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      );

    return words.join(" ") || "there";
  }

  function formatProfileText(value: string) {
    if (!value) {
      return "—";
    }

    return value
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (character) => character.toUpperCase());
  }

  return (
    <main className="dashboard-page">
      <h1 className="dashboard-title">Hey {getAccountDisplayName()}</h1>

      <div className="dashboard-layout">
        <section className="dashboard-card profile-panel">
          {!profile && (
            <>
              <div className="dashboard-card-heading">
                <h2>Profile</h2>
              </div>

              <p className="dashboard-muted">
                Complete your profile to get personalized daily nutrition
                targets.
              </p>

              <button
                className="dashboard-primary-button"
                type="button"
                onClick={onCompleteProfile}
              >
                Complete Profile
              </button>
            </>
          )}

          {profile && !isEditingProfile && (
            <>
              <div className="dashboard-card-heading">
                <h2>Profile</h2>

                <button
                  className="dashboard-small-button"
                  type="button"
                  onClick={startEditingProfile}
                >
                  Edit
                </button>
              </div>

              <div className="profile-details-grid">
                <div>
                  <span>Age</span>
                  <strong>{profile.age}</strong>
                </div>

                <div>
                  <span>Sex</span>
                  <strong>{formatProfileText(profile.sex)}</strong>
                </div>

                <div>
                  <span>Height</span>
                  <strong>{profile.height_cm} cm</strong>
                </div>

                <div>
                  <span>Weight</span>
                  <strong>{profile.weight_kg} kg</strong>
                </div>

                <div className="profile-detail-wide">
                  <span>Activity</span>
                  <strong>{formatProfileText(profile.activity_level)}</strong>
                </div>
              </div>
            </>
          )}

          {profile && isEditingProfile && (
            <>
              <div className="dashboard-card-heading">
                <h2>Edit Profile</h2>
              </div>

              <div className="profile-edit-grid">
                <input
                  type="number"
                  placeholder="Age"
                  min={1}
                  max={120}
                  step={1}
                  value={profileAge}
                  onChange={(event) => {
                    setProfileAge(event.target.value);
                    setProfileMessage("");
                  }}
                />

                <select
                  value={profileSex}
                  onChange={(event) => {
                    setProfileSex(event.target.value);
                    setProfileMessage("");
                  }}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>

                <input
                  type="number"
                  placeholder="Height (cm)"
                  min={40}
                  max={250}
                  step={0.1}
                  value={profileHeight}
                  onChange={(event) => {
                    setProfileHeight(event.target.value);
                    setProfileMessage("");
                  }}
                />

                <input
                  type="number"
                  placeholder="Weight (kg)"
                  min={2}
                  max={300}
                  step={0.1}
                  value={profileWeight}
                  onChange={(event) => {
                    setProfileWeight(event.target.value);
                    setProfileMessage("");
                  }}
                />

                <select
                  className="profile-edit-wide"
                  value={profileActivity}
                  onChange={(event) => {
                    setProfileActivity(event.target.value);
                    setProfileMessage("");
                  }}
                >
                  <option value="inactive">Inactive</option>
                  <option value="lowActive">Low active</option>
                  <option value="active">Active</option>
                  <option value="veryActive">Very active</option>
                </select>
              </div>

              {profileMessage && (
                <p className="profile-error-message">
                  <span aria-hidden="true">⚠</span>
                  <span>{profileMessage}</span>
                </p>
              )}

              <div className="dashboard-inline-actions">
                <button
                  className="dashboard-primary-button"
                  type="button"
                  onClick={onUpdateProfile}
                >
                  Save
                </button>

                <button
                  className="dashboard-secondary-button"
                  type="button"
                  onClick={cancelEditingProfile}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </section>

        <div className="dashboard-history-stack">
          <section className="dashboard-card history-panel">
            <button
              className="history-expand-button"
              type="button"
              onClick={() => {
                const next = !showNutritionHistory;
                setShowNutritionHistory(next);

                if (next) {
                  setShowFoodHistory(false);
                } else {
                  setSelectedDay(null);
                }
              }}
            >
              {showNutritionHistory
                ? "Hide Day Nutrition Summary"
                : "View Day Nutrition Summary"}
            </button>

            {showNutritionHistory && (
              <div className="calendar-history history-expanded-content">
                <div className="calendar-header">
                  <button
                    className="calendar-nav-button"
                    type="button"
                    onClick={() => changeCalendarMonth(-1)}
                    aria-label="Previous month"
                  >
                    ‹
                  </button>

                  <strong>{calendarMonthLabel}</strong>

                  <button
                    className="calendar-nav-button"
                    type="button"
                    onClick={() => changeCalendarMonth(1)}
                    aria-label="Next month"
                  >
                    ›
                  </button>
                </div>

                <div className="calendar-weekdays">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                <div className="calendar-grid">
                  {calendarDays.map((dayNumber, index) => {
                    if (dayNumber === null) {
                      return (
                        <span
                          className="calendar-empty"
                          key={`empty-${index}`}
                        />
                      );
                    }

                    const dateKey =
                      `${calendarYear}-` +
                      `${String(calendarMonth + 1).padStart(2, "0")}-` +
                      `${String(dayNumber).padStart(2, "0")}`;

                    const historyDay = historyDayByDate.get(dateKey);
                    const isSelected = selectedDateKey === dateKey;

                    if (historyDay) {
                      return (
                        <button
                          className={
                            isSelected
                              ? "calendar-day recorded-day selected-calendar-day"
                              : "calendar-day recorded-day"
                          }
                          key={dateKey}
                          type="button"
                          onClick={() => {
                            setHistoryTab(null);
                            onLoadDayDetails(historyDay.id);
                          }}
                        >
                          {dayNumber}
                        </button>
                      );
                    }

                    return (
                      <span className="calendar-day" key={dateKey}>
                        {dayNumber}
                      </span>
                    );
                  })}
                </div>

                {selectedDay && (
                  <div className="dashboard-summary-panel">
                    <HistoryDailySummary
                      day={selectedDay}
                      getNutrientDisplayName={getNutrientDisplayName}
                      formatNumber={formatNumber}
                      onBack={() => setSelectedDay(null)}
                    />
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="dashboard-card food-history-panel">
            <button
              className="history-expand-button"
              type="button"
              onClick={() => {
                const next = !showFoodHistory;
                setShowFoodHistory(next);

                if (next) {
                  setShowNutritionHistory(false);
                  setSelectedDay(null);
                }
              }}
            >
              {showFoodHistory ? "Hide Food History" : "View Food History"}
            </button>

            {showFoodHistory && (
              <div className="history-expanded-content">
                {foodHistory.length === 0 ? (
                  <p className="dashboard-muted">No food history yet.</p>
                ) : (
                  <div className="food-history-grid">
                    {foodHistory.map((food) => (
                      <article className="food-history-item" key={food.id}>
                        <strong>{food.food_name}</strong>
                        <span>
                          {food.amount} {food.unit}
                        </span>
                        <small>
                          {new Date(food.created_at).toLocaleString()}
                        </small>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default DashboardPage;
