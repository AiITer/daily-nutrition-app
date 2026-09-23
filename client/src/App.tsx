import { useEffect, useState } from "react";

type AppStage =
  | "checkingSession"
  | "loggedOut"
  | "newUserWelcome"
  | "profileSetup"
  | "app";

type RecommendationSection = "nutrition" | "remaining";

function formatNumber(value: number) {
  return Number(value.toFixed(2));
}

function getDailyNeedText(status: any) {
  if (!status) {
    return null;
  }

  if (status.targetType === "target" && status.target !== undefined) {
    return `${formatNumber(status.target)} ${status.unit}`;
  }

  if (
    status.targetType === "range" &&
    status.minTarget !== undefined &&
    status.maxTarget !== undefined
  ) {
    return `${formatNumber(status.minTarget)}-${formatNumber(
      status.maxTarget,
    )} ${status.unit}`;
  }

  if (status.targetType === "monitor") {
    return "No minimum target";
  }

  return null;
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
  const [foodMessage, setFoodMessage] = useState("");
  const [mealDetails, setMealDetails] = useState<Record<number, any>>({});
  const [expandedRemainingMealId, setExpandedRemainingMealId] = useState<
    number | null
    >(null);
  const [expandedRecommendation, setExpandedRecommendation] = useState<{
    mealId: number;
    nutrientKey: string;
    section: RecommendationSection;
  } | null>(null);

  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showAllRecommendations, setShowAllRecommendations] = useState(false);
  const [expandedNutrientGroups, setExpandedNutrientGroups] = useState<
    Record<string, boolean>
  >({});
  const [nowDayId, setNowDayId] = useState<number | null>(null);
  const [previousDayId, setPreviousDayId] = useState<number | null>(null);
  const [canStartNewDay, setCanStartNewDay] = useState(false);
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

  const macronutrientPriority = [
    "protein",
    "carbohydrate",
    "fat",
    "fiber",
    "totalSugar",
    "linoleicAcid",
    "alphaLinolenicAcid",
    "water",
    "saturatedFat",
    "transFat",
    "cholesterol",
  ];

  const vitaminPriority = [
    "vitaminD",
    "vitaminB12",
    "vitaminC",
    "vitaminA",
    "vitaminB9",
    "vitaminB6",
    "vitaminE",
    "vitaminK",
    "vitaminB1",
    "vitaminB2",
    "vitaminB3",
    "vitaminB5",
    "vitaminB7",
    "choline",
  ];

  const mineralPriority = [
    "iron",
    "calcium",
    "potassium",
    "magnesium",
    "zinc",
    "selenium",
    "phosphorus",
    "iodine",
    "copper",
    "manganese",
    "molybdenum",
    "sodium",
    "fluoride",
  ];

  const recommendationNutrientKeys = [
    "energy",
    "protein",
    "fiber",
    "calcium",
    "iron",
    "potassium",
    "magnesium",
    "zinc",
    "selenium",
    "vitaminA",
    "vitaminC",
    "vitaminD",
    "vitaminE",
    "vitaminK",
    "vitaminB1",
    "vitaminB2",
    "vitaminB3",
    "vitaminB6",
    "vitaminB9",
    "vitaminB12",
  ];

  const nutrientDisplayNames: Record<string, string> = {
    protein: "Protein",
    carbohydrate: "Carbohydrate",
    fat: "Fat",
    fiber: "Fiber",
    totalSugar: "Total Sugar",
    linoleicAcid: "Linoleic Acid",
    alphaLinolenicAcid: "Alpha-Linolenic Acid",
    water: "Water",
    saturatedFat: "Saturated Fat",
    transFat: "Trans Fat",
    cholesterol: "Cholesterol",

    vitaminA: "Vitamin A",
    vitaminC: "Vitamin C",
    vitaminD: "Vitamin D",
    vitaminE: "Vitamin E",
    vitaminK: "Vitamin K",
    vitaminB1: "Vitamin B1",
    vitaminB2: "Vitamin B2",
    vitaminB3: "Vitamin B3",
    vitaminB5: "Vitamin B5",
    vitaminB6: "Vitamin B6",
    vitaminB7: "Vitamin B7",
    vitaminB9: "Vitamin B9",
    vitaminB12: "Vitamin B12",
    choline: "Choline",

    calcium: "Calcium",
    copper: "Copper",
    fluoride: "Fluoride",
    iodine: "Iodine",
    iron: "Iron",
    magnesium: "Magnesium",
    manganese: "Manganese",
    molybdenum: "Molybdenum",
    phosphorus: "Phosphorus",
    potassium: "Potassium",
    selenium: "Selenium",
    sodium: "Sodium",
    zinc: "Zinc",
  };

  function getNutrientDisplayName(nutrientKey: string) {
    return nutrientDisplayNames[nutrientKey] ?? nutrientKey;
  }

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

  function toggleNutrientGroup(
    mealId: number,
    group: "macronutrients" | "vitamins" | "minerals",
  ) {
    const key = `${mealId}-${group}`;

    setExpandedNutrientGroups((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

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

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const currentDayResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/api/days/current?timeZone=${encodeURIComponent(timeZone)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const currentDayData = await currentDayResponse.json();
    console.log(
      "current day response:",
      currentDayResponse.status,
      currentDayResponse.ok,
    );

    if (currentDayResponse.ok) {
      setCanStartNewDay(currentDayData.canStartNewDay);
      setNowDayId(currentDayData.nowDay ? currentDayData.nowDay.id : null);
      setPreviousDayId(
        currentDayData.previousDay ? currentDayData.previousDay.id : null,
      );
      console.log("setting nowDayId to:", currentDayData.nowDay?.id);

      if (currentDayData.activeDay) {
        setActiveDayId(currentDayData.activeDay.id);        
        await loadMealSessions(currentDayData.activeDay.id);
      } else {
        setActiveDayId(null);
        setMealSessions([]);
        setMealDetails({});
      }
    }
    console.log("currentDayData:", currentDayData);
    console.log("nowDay:", currentDayData.nowDay);
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

  async function loadRecommendations(
    mealId: number,
    nutrientKey: string,
    section: RecommendationSection,
  ) {
    const isAlreadyOpen =
      expandedRecommendation?.mealId === mealId &&
      expandedRecommendation?.nutrientKey === nutrientKey &&
      expandedRecommendation?.section === section;

    if (isAlreadyOpen) {
      setExpandedRecommendation(null);
      setRecommendations([]);
      setShowAllRecommendations(false);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/recommendations/${nutrientKey}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Failed to load recommendations");
      return;
    }

    setExpandedRecommendation({
      mealId,
      nutrientKey,
      section,
    });

    setRecommendations(data.recommendations);
    setShowAllRecommendations(false);
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
    if (!canStartNewDay) {
      return;
    }
    
    const token = localStorage.getItem("token");
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/days`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        timeZone,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Failed to start new day");
      return;
    }

    setActiveDayId(data.id);
    setMealSessions([]);
    setMealDetails({});
    setCanStartNewDay(false);
    setSelectedDay(null);
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
    await Promise.all(
      data.mealSessions.map((meal: any) => loadMealDetails(meal.id)),
    );
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
    console.log("meal nutrition:", data.nutrition);

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

  async function handleDeleteFood(foodEntryId: number, mealSessionId: number) {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/foods/${foodEntryId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Failed to delete food");
      return;
    }

    await loadMealDetails(mealSessionId);

    setMessage("Food deleted");
  }

  async function handleDeleteMeal(mealSessionId: number) {
    if (activeDayId === null) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/meal-sessions/${mealSessionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Failed to delete meal");
      return;
    }

    await loadMealSessions(activeDayId);

    setMessage("Meal deleted");
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

  async function handleAddFood(mealSessionId: number) {
    if (activeDayId === null) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/days/${activeDayId}/foods`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
      if (data.error === "Failed to add food") {
        setFoodMessage(
          "This food is not supported yet. Please try another food name.",
        );
      } else {
        setFoodMessage(data.error ?? "Failed to add food");
      }

      return;
    }

    await loadMealDetails(mealSessionId);

    setFoodName("");
    setFoodAmount("");
    setAddingMealId(null);
    setFoodMessage("");

  }

  async function handleFinishDay() {
    if (activeDayId === null) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/days/${activeDayId}/finish`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Failed to finish day");
      return;
    }

    setActiveDayId(null);
    setMealSessions([]);
    setMealDetails({});
    setExpandedRemainingMealId(null);

    await loadUserData(token);

    setMessage("Day finished");
  }

  async function handleUpdateProfile() {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/profile`,
      {
        method: "PUT",
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
      setMessage(data.error ?? "Failed to update profile");
      return;
    }

    setProfile(data.profile);
    setIsEditingProfile(false);
    setMessage("Profile updated");
  }

  function handleCancelAddFood() {
    setAddingMealId(null);
    setFoodName("");
    setFoodAmount("");
    setFoodUnit("g");
    setFoodMessage("");
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
        <button onClick={handleStartNewDay} disabled={!canStartNewDay}>
          Start New Day
        </button>
      )}

      {appStage === "app" && activeDayId !== null && (
        <div>
          <button onClick={handleNewMeal}>New Meal</button>
          {mealSessions.map((meal, index) => (
            <div key={meal.id}>
              <h3>Meal {index + 1}</h3>
              <button type="button" onClick={() => handleDeleteMeal(meal.id)}>
                Delete Meal
              </button>
              {mealDetails[meal.id]?.foods?.map((food: any) => (
                <div key={food.id}>
                  <span>
                    {food.food_name} — {food.amount} {food.unit}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteFood(food.id, meal.id)}
                  >
                    Delete Food
                  </button>
                </div>
              ))}
              {mealDetails[meal.id]?.nutrition?.length > 0 && (
                <div>
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
                        <div key={nutrient.nutrientKey}>
                          <strong>Energy</strong>

                          <p>
                            Consumed: {formatNumber(nutrient.amount)}{" "}
                            {nutrient.unit}
                          </p>

                          {getDailyNeedText(status) && (
                            <p>Daily Need: {getDailyNeedText(status)}</p>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              loadRecommendations(
                                meal.id,
                                "energy",
                                "nutrition",
                              )
                            }
                          >
                            Food Suggestions
                          </button>

                          {expandedRecommendation?.mealId === meal.id &&
                            expandedRecommendation?.nutrientKey === "energy" &&
                            expandedRecommendation?.section === "nutrition" && (
                              <div>
                                {recommendations
                                  .slice(0, showAllRecommendations ? 5 : 3)
                                  .map((recommendation: any) => (
                                    <div key={recommendation.foodId}>
                                      <strong>
                                        {recommendation.displayName}
                                      </strong>

                                      <p>
                                        {formatNumber(
                                          recommendation.nutrientAmountPer100Units,
                                        )}{" "}
                                        {recommendation.unit} per 100{" "}
                                        {recommendation.basisUnit}
                                      </p>
                                    </div>
                                  ))}

                                {recommendations.length > 3 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowAllRecommendations(
                                        !showAllRecommendations,
                                      )
                                    }
                                  >
                                    {showAllRecommendations ? "Less" : "More"}
                                  </button>
                                )}
                              </div>
                            )}
                        </div>
                      );
                    })}

                  <div>
                    <h5>Macronutrients</h5>

                    {(expandedNutrientGroups[`${meal.id}-macronutrients`]
                      ? macronutrientPriority
                      : macronutrientPriority.slice(0, 5)
                    ).map((nutrientKey) => {
                      const nutrient = mealDetails[meal.id]?.nutrition?.find(
                        (item: any) => item.nutrientKey === nutrientKey,
                      );

                      if (!nutrient) {
                        return null;
                      }

                      const status = mealDetails[
                        meal.id
                      ]?.nutritionStatusThroughMeal?.find(
                        (item: any) => item.nutrientKey === nutrientKey,
                      );

                      const dailyNeed = getDailyNeedText(status);

                      return (
                        <div key={nutrientKey}>
                          <strong>{getNutrientDisplayName(nutrientKey)}</strong>

                          <p>
                            Consumed: {formatNumber(nutrient.amount)}{" "}
                            {nutrient.unit}
                          </p>

                          {status?.targetType === "monitor" ? (
                            <p>{dailyNeed}</p>
                          ) : (
                            dailyNeed && <p>Daily Need: {dailyNeed}</p>
                          )}

                          {recommendationNutrientKeys.includes(nutrientKey) && (
                            <button
                              type="button"
                              onClick={() =>
                                loadRecommendations(
                                  meal.id,
                                  nutrientKey,
                                  "nutrition",
                                )
                              }
                            >
                              Food Suggestions
                            </button>
                          )}

                          {expandedRecommendation?.mealId === meal.id &&
                            expandedRecommendation?.nutrientKey ===
                              nutrientKey &&
                            expandedRecommendation?.section === "nutrition" && (
                              <div>
                                {recommendations
                                  .slice(0, showAllRecommendations ? 5 : 3)
                                  .map((recommendation: any) => (
                                    <div key={recommendation.foodId}>
                                      <strong>
                                        {recommendation.displayName}
                                      </strong>

                                      <p>
                                        {formatNumber(
                                          recommendation.nutrientAmountPer100Units,
                                        )}{" "}
                                        {recommendation.unit} per 100{" "}
                                        {recommendation.basisUnit}
                                      </p>
                                    </div>
                                  ))}

                                {recommendations.length > 3 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowAllRecommendations(
                                        !showAllRecommendations,
                                      )
                                    }
                                  >
                                    {showAllRecommendations ? "Less" : "More"}
                                  </button>
                                )}
                              </div>
                            )}
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() =>
                        toggleNutrientGroup(meal.id, "macronutrients")
                      }
                    >
                      {expandedNutrientGroups[`${meal.id}-macronutrients`]
                        ? "See Less"
                        : "See More"}
                    </button>
                  </div>
                  <div>
                    <h5>Vitamins</h5>

                    {(expandedNutrientGroups[`${meal.id}-vitamins`]
                      ? vitaminPriority
                      : vitaminPriority.slice(0, 5)
                    ).map((nutrientKey) => {
                      const nutrient = mealDetails[meal.id]?.nutrition?.find(
                        (item: any) => item.nutrientKey === nutrientKey,
                      );

                      if (!nutrient) {
                        return null;
                      }

                      const status = mealDetails[
                        meal.id
                      ]?.nutritionStatusThroughMeal?.find(
                        (item: any) => item.nutrientKey === nutrientKey,
                      );

                      const dailyNeed = getDailyNeedText(status);

                      return (
                        <div key={nutrientKey}>
                          <strong>{getNutrientDisplayName(nutrientKey)}</strong>

                          <p>
                            Consumed: {formatNumber(nutrient.amount)}{" "}
                            {nutrient.unit}
                          </p>

                          {dailyNeed && <p>Daily Need: {dailyNeed}</p>}

                          {recommendationNutrientKeys.includes(nutrientKey) && (
                            <button
                              type="button"
                              onClick={() =>
                                loadRecommendations(
                                  meal.id,
                                  nutrientKey,
                                  "nutrition",
                                )
                              }
                            >
                              Food Suggestions
                            </button>
                          )}

                          {expandedRecommendation?.mealId === meal.id &&
                            expandedRecommendation?.nutrientKey ===
                              nutrientKey &&
                            expandedRecommendation?.section === "nutrition" && (
                              <div>
                                {recommendations
                                  .slice(0, showAllRecommendations ? 5 : 3)
                                  .map((recommendation: any) => (
                                    <div key={recommendation.foodId}>
                                      <strong>
                                        {recommendation.displayName}
                                      </strong>

                                      <p>
                                        {formatNumber(
                                          recommendation.nutrientAmountPer100Units,
                                        )}{" "}
                                        {recommendation.unit} per 100{" "}
                                        {recommendation.basisUnit}
                                      </p>
                                    </div>
                                  ))}

                                {recommendations.length > 3 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowAllRecommendations(
                                        !showAllRecommendations,
                                      )
                                    }
                                  >
                                    {showAllRecommendations ? "Less" : "More"}
                                  </button>
                                )}
                              </div>
                            )}
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => toggleNutrientGroup(meal.id, "vitamins")}
                    >
                      {expandedNutrientGroups[`${meal.id}-vitamins`]
                        ? "See Less"
                        : "See More"}
                    </button>
                  </div>
                  <div>
                    <h5>Minerals</h5>

                    {(expandedNutrientGroups[`${meal.id}-minerals`]
                      ? mineralPriority
                      : mineralPriority.slice(0, 5)
                    ).map((nutrientKey) => {
                      const nutrient = mealDetails[meal.id]?.nutrition?.find(
                        (item: any) => item.nutrientKey === nutrientKey,
                      );

                      if (!nutrient) {
                        return null;
                      }

                      const status = mealDetails[
                        meal.id
                      ]?.nutritionStatusThroughMeal?.find(
                        (item: any) => item.nutrientKey === nutrientKey,
                      );

                      const dailyNeed = getDailyNeedText(status);

                      return (
                        <div key={nutrientKey}>
                          <strong>{getNutrientDisplayName(nutrientKey)}</strong>

                          <p>
                            Consumed: {formatNumber(nutrient.amount)}{" "}
                            {nutrient.unit}
                          </p>

                          {dailyNeed && <p>Daily Need: {dailyNeed}</p>}

                          {recommendationNutrientKeys.includes(nutrientKey) && (
                            <button
                              type="button"
                              onClick={() =>
                                loadRecommendations(
                                  meal.id,
                                  nutrientKey,
                                  "nutrition",
                                )
                              }
                            >
                              Food Suggestions
                            </button>
                          )}

                          {expandedRecommendation?.mealId === meal.id &&
                            expandedRecommendation?.nutrientKey ===
                              nutrientKey &&
                            expandedRecommendation?.section === "nutrition" && (
                              <div>
                                {recommendations
                                  .slice(0, showAllRecommendations ? 5 : 3)
                                  .map((recommendation: any) => (
                                    <div key={recommendation.foodId}>
                                      <strong>
                                        {recommendation.displayName}
                                      </strong>

                                      <p>
                                        {formatNumber(
                                          recommendation.nutrientAmountPer100Units,
                                        )}{" "}
                                        {recommendation.unit} per 100{" "}
                                        {recommendation.basisUnit}
                                      </p>
                                    </div>
                                  ))}

                                {recommendations.length > 3 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowAllRecommendations(
                                        !showAllRecommendations,
                                      )
                                    }
                                  >
                                    {showAllRecommendations ? "Less" : "More"}
                                  </button>
                                )}
                              </div>
                            )}
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => toggleNutrientGroup(meal.id, "minerals")}
                    >
                      {expandedNutrientGroups[`${meal.id}-minerals`]
                        ? "See Less"
                        : "See More"}
                    </button>
                  </div>
                </div>
              )}

              <button
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

              {expandedRemainingMealId === meal.id &&
                mealDetails[meal.id]?.nutritionStatusThroughMeal?.length >
                  0 && (
                  <div>
                    <h4>Daily Remaining After This Meal</h4>

                    {mealDetails[meal.id].nutritionStatusThroughMeal
                      .filter(
                        (nutrient: any) =>
                          keyNutrients.includes(nutrient.nutrientKey) &&
                          nutrient.remaining !== undefined,
                      )
                      .map((nutrient: any) => (
                        <div key={nutrient.nutrientKey}>
                          <strong>{nutrient.nutrientKey}</strong>

                          <p>
                            Remaining: {formatNumber(nutrient.remaining)}{" "}
                            {nutrient.unit}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              loadRecommendations(
                                meal.id,
                                nutrient.nutrientKey,
                                "remaining",
                              )
                            }
                          >
                            See Food Suggestions
                          </button>

                          {expandedRecommendation?.mealId === meal.id &&
                            expandedRecommendation?.nutrientKey ===
                              nutrient.nutrientKey &&
                            expandedRecommendation?.section === "remaining" &&
                            recommendations.length > 0 && (
                              <div>
                                {recommendations
                                  .slice(
                                    0,
                                    showAllRecommendations
                                      ? recommendations.length
                                      : 3,
                                  )
                                  .map((recommendation: any) => (
                                    <div key={recommendation.foodId}>
                                      <strong>
                                        {recommendation.displayName}
                                      </strong>

                                      <p>
                                        {formatNumber(
                                          recommendation.recommendation
                                            .nutrientAmountPer100Units,
                                        )}{" "}
                                        {recommendation.unit} per 100{" "}
                                        {recommendation.basisUnit}
                                      </p>
                                    </div>
                                  ))}

                                {recommendations.length > 3 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowAllRecommendations(
                                        !showAllRecommendations,
                                      )
                                    }
                                  >
                                    {showAllRecommendations ? "Less" : "More"}
                                  </button>
                                )}
                              </div>
                            )}
                        </div>
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

                  <button type="button" onClick={handleCancelAddFood}>
                    Cancel
                  </button>
                  {foodMessage && <p>{foodMessage}</p>}
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

      {appStage === "app" && activeDayId !== null && (
        <button onClick={handleFinishDay}>Finish the Day</button>
      )}
      {activeDayId === null && nowDayId !== null && (
        <button onClick={() => loadDayDetails(nowDayId)}>
          View Today's Summary
        </button>
      )}
      {activeDayId === null && nowDayId === null && previousDayId !== null && (
        <button onClick={() => loadDayDetails(previousDayId)}>
          View Previous Day Summary
        </button>
      )}
      {selectedDay && (
        <div>
          <h3>Daily Summary</h3>
          <p>{selectedDay.day.session_date.slice(0, 10)}</p>

          {selectedDay.nutritionStatus
            .filter((nutrient: any) =>
              keyNutrients.includes(nutrient.nutrientKey),
            )
            .map((nutrient: any) => (
              <div key={nutrient.nutrientKey}>
                <strong>{nutrient.nutrientKey}</strong>

                <p>
                  Consumed: {formatNumber(nutrient.consumed)} {nutrient.unit}
                </p>

                {nutrient.target !== undefined && (
                  <p>
                    Daily target: {formatNumber(nutrient.target)}{" "}
                    {nutrient.unit}
                  </p>
                )}
              </div>
            ))}
          <button type="button" onClick={() => setSelectedDay(null)}>
            Back
          </button>
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

          <button onClick={handleUpdateProfile}>Save</button>

          <button onClick={() => setIsEditingProfile(false)}>Cancel</button>
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
                  <h3>Daily Summary</h3>
                  <p>{selectedDay.day.session_date.slice(0, 10)}</p>

                  {selectedDay.nutritionStatus
                    .filter((nutrient: any) =>
                      keyNutrients.includes(nutrient.nutrientKey),
                    )
                    .map((nutrient: any) => (
                      <div key={nutrient.nutrientKey}>
                        <strong>{nutrient.nutrientKey}</strong>

                        <p>
                          Consumed: {formatNumber(nutrient.consumed)}{" "}
                          {nutrient.unit}
                        </p>

                        {nutrient.target !== undefined && (
                          <p>
                            Daily target: {formatNumber(nutrient.target)}{" "}
                            {nutrient.unit}
                          </p>
                        )}
                      </div>
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
