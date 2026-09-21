import { useEffect, useState } from "react";

type AppStage =
  | "checkingSession"
  | "loggedOut"
  | "newUserWelcome"
  | "profileSetup"
  | "app";

function formatNumber(value: number) {
  return Number(value.toFixed(2));
}

function App() {
  const [appStage, setAppStage] = useState<AppStage>("checkingSession");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("luna@example.com");
  const [password, setPassword] = useState("test123456");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [days, setDays] = useState<any[]>([]);
  const [foodHistory, setFoodHistory] = useState<any[]>([]);
  const [activeDayId, setActiveDayId] = useState<number | null>(null);
  const [mealSessions, setMealSessions] = useState<any[]>([]);
  const [addingMealId, setAddingMealId] = useState<number | null>(null);
  const [foodName, setFoodName] = useState("");
  const [foodAmount, setFoodAmount] = useState("");
  const [foodUnit, setFoodUnit] = useState("g");
  const [mealDetails, setMealDetails] = useState<Record<number, any>>({});
  const [historyTab, setHistoryTab] = useState<"foods" | "nutrition" | null>(
    null,
  );
  const [selectedDay, setSelectedDay] = useState<any>(null);

  const [profileAge, setProfileAge] = useState("");
  const [profileSex, setProfileSex] = useState("");
  const [profileHeight, setProfileHeight] = useState("");
  const [profileWeight, setProfileWeight] = useState("");
  const [profileActivity, setProfileActivity] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const keyNutrients = ["energy", "protein", "fiber"];

  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("token");

      if (!token) {
        setAppStage("loggedOut");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("token");
          setAppStage("loggedOut");
          return;
        }

        await loadUserData(token);

        setAppStage("app");
      } catch {
        setMessage("Failed to restore session");
        setAppStage("loggedOut");
      }
    }

    restoreSession();
  }, []);

  async function handleRegister() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "Registration failed");
        return;
      }

      setRegistrationSuccess(true);
      setAuthMode("login");
      setMessage("");
    } catch {
      setMessage("Registration failed");
    }
  }

  async function handleLogin() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      await loadUserData(data.token);

      if (registrationSuccess) {
        setAppStage("newUserWelcome");
        setRegistrationSuccess(false);
      } else {
        setAppStage("app");
      }

      setMessage("");
    } catch {
      setMessage("Login failed");
    }
  }

  async function loadUserData(token: string) {
    const profileResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/api/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (profileResponse.status === 404) {
      setProfile(null);
    } else {
      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        setMessage(profileData.error ?? "Failed to load profile");
        return;
      }

      setProfile(profileData.profile);
    }

    const daysResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/api/days`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const daysData = await daysResponse.json();

    if (!daysResponse.ok) {
      setMessage(daysData.error ?? "Failed to load days");
      return;
    }

    setDays(daysData.days);
    const today = new Date().toISOString().slice(0, 10);

    const todayDay = daysData.days.find(
      (day: any) => day.session_date.slice(0, 10) === today,
    );

    if (todayDay) {
      setActiveDayId(todayDay.id);
      await loadMealSessions(todayDay.id);
    }

    const foodHistoryResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/api/history/foods`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const foodHistoryData = await foodHistoryResponse.json();

    if (!foodHistoryResponse.ok) {
      setMessage(foodHistoryData.error ?? "Failed to load food history");
      return;
    }

    setFoodHistory(foodHistoryData.foods);
  }

  function handleLogout() {
    localStorage.removeItem("token");

    setAppStage("loggedOut");
    setProfile(null);

    setDays([]);
    setFoodHistory([]);
    setSelectedDay(null);
    setHistoryTab(null);

    setIsEditingProfile(false);
    setRegistrationSuccess(false);

    setMessage("");
  }

  async function handleCreateProfile() {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          age: Number(profileAge),
          sex: profileSex,
          heightCm: Number(profileHeight),
          weightKg: Number(profileWeight),
          activityLevel: profileActivity,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Failed to create profile");
      return;
    }

    setProfile(data.profile);
    setAppStage("app");
    setMessage("Profile created");
  }

  async function handleStartNewDay() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/days`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Failed to start new day");
      return;
    }

    setActiveDayId(data.id);
    setMealSessions([]);
    setMessage("New day started");
  }

  async function loadMealSessions(daySessionId: number) {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/days/${daySessionId}/meal-sessions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Failed to load meals");
      return;
    }

    setMealSessions(data.mealSessions);
    for (const meal of data.mealSessions) {
      await loadMealDetails(meal.id);
    }
  }

  async function loadMealDetails(mealSessionId: number) {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/meal-sessions/${mealSessionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Failed to load meal details");
      return;
    }

    setMealDetails((current) => ({
      ...current,
      [mealSessionId]: data,
    }));
  }

  async function handleNewMeal() {
    if (activeDayId === null) {
      setMessage("Start a day first");
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/days/${activeDayId}/meal-sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Failed to create meal");
      return;
    }

    await loadMealSessions(activeDayId);

    setMessage("New meal created");
  }

  async function handleAddFood(mealSessionId: number) {
    if (activeDayId === null) {
      setMessage("No active day");
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/days/${activeDayId}/foods`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          foodName,
          amount: Number(foodAmount),
          unit: foodUnit,
          mealSessionId,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Failed to add food");
      return;
    }

    await loadMealDetails(mealSessionId);

    setFoodName("");
    setFoodAmount("");
    setAddingMealId(null);
    setMessage("Food added");
  }

  async function loadDayDetails(daySessionId: number) {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/days/${daySessionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Failed to load day");
      return;
    }

    setSelectedDay(data);
  }

  return (
    <div>
      {appStage === "checkingSession" && (
        <div>
          <p>Loading...</p>
        </div>
      )}
      {appStage === "loggedOut" && (
        <div>
          <h1>Daily Nutrition</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {authMode === "login" ? (
            <>
              <button onClick={handleLogin}>Log in</button>

              <p>
                Don't have an account?{" "}
                <button type="button" onClick={() => setAuthMode("register")}>
                  Register
                </button>
              </p>
            </>
          ) : (
            <>
              <button onClick={handleRegister}>Create account</button>

              <p>
                Already have an account?{" "}
                <button type="button" onClick={() => setAuthMode("login")}>
                  Log in
                </button>
              </p>
            </>
          )}
        </div>
      )}

      {appStage === "newUserWelcome" && (
        <div>
          <h2>Welcome to Daily Nutrition</h2>

          <p>Your account is ready.</p>

          <p>
            Complete your profile to get personalized daily nutrition targets,
            or skip for now and explore the app first.
          </p>

          <div>
            <button type="button" onClick={() => setAppStage("app")}>
              Skip for now
            </button>

            <button type="button" onClick={() => setAppStage("profileSetup")}>
              Complete Profile
            </button>
          </div>
        </div>
      )}

      {appStage === "profileSetup" && (
        <div>
          <h2>Complete your profile</h2>

          <p>
            To calculate your personalized daily nutrition targets, please
            complete your profile first.
          </p>

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
            <option value="">Select sex</option>
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

          <div>
            <h3>Activity Level</h3>

            <p>
              Choose the option that best matches your usual daily activity. If
              none fits exactly, select the closest one.
            </p>

            <label>
              <input
                type="radio"
                name="activityLevel"
                value="inactive"
                checked={profileActivity === "inactive"}
                onChange={(event) => setProfileActivity(event.target.value)}
              />

              <span>
                <strong>Inactive</strong>
                <br />
                Activities of daily living, such as about 30 minutes of walking
                plus light-to-moderate household activity.
              </span>
            </label>

            <label>
              <input
                type="radio"
                name="activityLevel"
                value="lowActive"
                checked={profileActivity === "lowActive"}
                onChange={(event) => setProfileActivity(event.target.value)}
              />

              <span>
                <strong>Low active</strong>
                <br />
                Daily living activities plus about 60 to 80 minutes of walking
                at 5 to 7 km/h.
              </span>
            </label>

            <label>
              <input
                type="radio"
                name="activityLevel"
                value="active"
                checked={profileActivity === "active"}
                onChange={(event) => setProfileActivity(event.target.value)}
              />

              <span>
                <strong>Active</strong>
                <br />
                Daily living activities plus additional moderate activity, such
                as walking, cycling, and recreational sports.
              </span>
            </label>

            <label>
              <input
                type="radio"
                name="activityLevel"
                value="veryActive"
                checked={profileActivity === "veryActive"}
                onChange={(event) => setProfileActivity(event.target.value)}
              />

              <span>
                <strong>Very active</strong>
                <br />
                Daily living activities plus substantial additional activity,
                such as cycling, jogging, and recreational sports.
              </span>
            </label>
          </div>

          <div>
            <button type="button" onClick={() => setAppStage("app")}>
              Skip for now
            </button>

            <button onClick={handleCreateProfile}>Finish</button>
          </div>
        </div>
      )}

      {appStage === "app" && <button onClick={handleLogout}>Log out</button>}
      {appStage === "app" && (
        <button onClick={handleStartNewDay}>Start New Day</button>
      )}

      {appStage === "app" && activeDayId !== null && (
        <div>
          <button onClick={handleNewMeal}>New Meal</button>
          {mealSessions.map((meal, index) => (
            <div key={meal.id}>
              <h3>Meal {index + 1}</h3>

              {mealDetails[meal.id]?.foods?.map((food: any) => (
                <p key={food.id}>
                  {food.food_name} — {food.amount} {food.unit}
                </p>
              ))}

              {mealDetails[meal.id]?.nutrition && (
                <div>
                  <h4>Meal Nutrition</h4>

                  {mealDetails[meal.id].nutrition
                    .filter((nutrient: any) =>
                      keyNutrients.includes(nutrient.nutrientKey),
                    )
                    .map((nutrient: any) => (
                      <p key={nutrient.nutrientKey}>
                        {nutrient.nutrientKey}: {nutrient.amount}{" "}
                        {nutrient.unit}
                      </p>
                    ))}
                </div>
              )}

              {mealDetails[meal.id]?.currentNutritionStatus && (
                <div>
                  <h4>Daily Remaining</h4>

                  {mealDetails[meal.id].currentNutritionStatus
                    .filter((nutrient: any) =>
                      keyNutrients.includes(nutrient.nutrientKey),
                    )
                    .map((nutrient: any) => (
                      <p key={nutrient.nutrientKey}>
                        {nutrient.nutrientKey}:{" "}
                        {formatNumber(nutrient.remaining)} {nutrient.unit}{" "}
                        remaining
                      </p>
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

                  <button onClick={() => handleAddFood(meal.id)}>
                    Save Food
                  </button>

                  <button type="button" onClick={() => setAddingMealId(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setAddingMealId(meal.id)}>
                  Add Food
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <p>{message}</p>
      {profile && !isEditingProfile && (
        <div>
          <h2>Profile</h2>

          <p>Age: {profile.age}</p>
          <p>Sex: {profile.sex}</p>
          <p>Height: {profile.height_cm} cm</p>
          <p>Weight: {profile.weight_kg} kg</p>
          <p>Activity: {profile.activity_level}</p>

          <button
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
      {profile && (
        <div>
          <h2>History</h2>

          <button onClick={() => setHistoryTab("foods")}>Food Entries</button>

          <button onClick={() => setHistoryTab("nutrition")}>
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

          {historyTab === "nutrition" && (
            <div>
              {days.map((day) => (
                <button key={day.id} onClick={() => loadDayDetails(day.id)}>
                  {day.session_date.slice(0, 10)}
                </button>
              ))}

              {selectedDay && (
                <div>
                  <h3>{selectedDay.day.session_date.slice(0, 10)}</h3>

                  {selectedDay.nutritionStatus.map((nutrient: any) => (
                    <p key={nutrient.nutrientKey}>
                      {nutrient.nutrientKey}: {nutrient.consumed}{" "}
                      {nutrient.unit}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
