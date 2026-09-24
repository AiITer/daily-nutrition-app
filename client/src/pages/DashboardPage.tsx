import DailySummary from "../components/DailySummary";
import { useState } from "react";

type DashboardPageProps = {
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

  setProfileAge: (value: string) => void;
  setProfileSex: (value: string) => void;
  setProfileHeight: (value: string) => void;
  setProfileWeight: (value: string) => void;
  setProfileActivity: (value: string) => void;
  setIsEditingProfile: (value: boolean) => void;

  setHistoryTab: (value: "foods" | "nutrition" | null) => void;
  setSelectedDay: (value: any) => void;

  onUpdateProfile: () => void;
  onLoadDayDetails: (dayId: number) => void;
  onCompleteProfile: () => void;

  getNutrientDisplayName: (nutrientKey: string) => string;
  formatNumber: (value: number | string) => number;
};

function DashboardPage({
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

  setProfileAge,
  setProfileSex,
  setProfileHeight,
  setProfileWeight,
  setProfileActivity,
  setIsEditingProfile,

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

  function changeCalendarMonth(offset: number) {
    const nextMonth = new Date(calendarYear, calendarMonth + offset, 1);

    setCalendarYear(nextMonth.getFullYear());
    setCalendarMonth(nextMonth.getMonth());
  }
  return (
    <div>
      <h1>Dashboard</h1>
      {!profile && (
        <div>
          <h2>Profile</h2>

          <p>
            Complete your profile to get personalized daily nutrition targets.
          </p>

          <button type="button" onClick={onCompleteProfile}>
            Complete Profile
          </button>
        </div>
      )}

      {profile && !isEditingProfile && (
        <div>
          <h2>Profile</h2>

          <p>Age: {profile.age}</p>
          <p>Sex: {profile.sex}</p>
          <p>Height: {profile.height_cm} cm</p>
          <p>Weight: {profile.weight_kg} kg</p>
          <p>Activity: {profile.activity_level}</p>

          <button
            type="button"
            onClick={() => {
              setProfileAge(String(profile.age));
              setProfileSex(profile.sex);
              setProfileHeight(String(profile.height_cm));
              setProfileWeight(String(profile.weight_kg));
              setProfileActivity(profile.activity_level);

              setIsEditingProfile(true);
            }}
          >
            Edit Profile
          </button>
        </div>
      )}
      
      {profile && isEditingProfile && (
        <div>
          <h2>Edit Profile</h2>

          <input
            type="number"
            placeholder="Age"
            value={profileAge}
            onChange={(event) => setProfileAge(event.target.value)}
          />

          <select
            value={profileSex}
            onChange={(event) => setProfileSex(event.target.value)}
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>

          <input
            type="number"
            placeholder="Height (cm)"
            value={profileHeight}
            onChange={(event) => setProfileHeight(event.target.value)}
          />

          <input
            type="number"
            placeholder="Weight (kg)"
            value={profileWeight}
            onChange={(event) => setProfileWeight(event.target.value)}
          />

          <select
            value={profileActivity}
            onChange={(event) => setProfileActivity(event.target.value)}
          >
            <option value="inactive">Inactive</option>
            <option value="lowActive">Low active</option>
            <option value="active">Active</option>
            <option value="veryActive">Very active</option>
          </select>

          <button onClick={onUpdateProfile}>Save</button>

          <button onClick={() => setIsEditingProfile(false)}>Cancel</button>
        </div>
      )}
      {
        <div>
          <h2>History</h2>

          <button
            onClick={() => {
              setHistoryTab("foods");
            }}
          >
            Food Entries
          </button>

          <button
            onClick={() => {
              setHistoryTab("nutrition");
            }}
          >
            Daily Nutrition
          </button>
          {historyTab === "foods" && (
            <div>
              {foodHistory.map((food) => (
                <div key={food.id}>
                  <p>
                    {food.food_name} — {food.amount} {food.unit}
                  </p>

                  <p>{new Date(food.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}

          {historyTab === null ||
            (historyTab === "nutrition" && (
              <div>
                <div>
                  <button type="button" onClick={() => changeCalendarMonth(-1)}>
                    Previous
                  </button>

                  <strong>{calendarMonthLabel}</strong>

                  <button type="button" onClick={() => changeCalendarMonth(1)}>
                    Next
                  </button>
                </div>

                <div>
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                <div>
                  {calendarDays.map((dayNumber, index) => {
                    if (dayNumber === null) {
                      return <span key={`empty-${index}`} />;
                    }

                    const dateKey =
                      `${calendarYear}-` +
                      `${String(calendarMonth + 1).padStart(2, "0")}-` +
                      `${String(dayNumber).padStart(2, "0")}`;

                    const historyDay = historyDayByDate.get(dateKey);

                    return historyDay ? (
                      <button
                        key={dateKey}
                        type="button"
                        onClick={() => onLoadDayDetails(historyDay.id)}
                      >
                        {dayNumber}
                      </button>
                    ) : (
                      <span key={dateKey}>{dayNumber}</span>
                    );
                  })}
                </div>

                {selectedDay && (
                  <DailySummary
                    day={selectedDay}
                    getNutrientDisplayName={getNutrientDisplayName}
                    formatNumber={formatNumber}
                    onBack={() => setSelectedDay(null)}
                  />
                )}
              </div>
            ))}
        </div>
      }
    </div>
  );
}

export default DashboardPage;
