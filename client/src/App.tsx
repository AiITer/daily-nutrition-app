import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";

type AppStage =
  | "checkingSession"
  | "loggedOut"
  | "newUserWelcome"
  | "app";

type RecommendationSection = "nutrition" | "remaining";

function formatNumber(value: number | string) {
  return Number(Number(value).toFixed(2));
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
  const navigate = useNavigate();
  const location = useLocation();
  const [appStage, setAppStage] = useState<AppStage>("checkingSession");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
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
  const [profileMessage, setProfileMessage] = useState("");

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
    "carbohydrate",
    "fat",
    "fiber",
    "linoleicAcid",
    "alphaLinolenicAcid",
    "water",

    "vitaminA",
    "vitaminC",
    "vitaminD",
    "vitaminE",
    "vitaminK",
    "vitaminB1",
    "vitaminB2",
    "vitaminB3",
    "vitaminB5",
    "vitaminB6",
    "vitaminB7",
    "vitaminB9",
    "vitaminB12",
    "choline",

    "calcium",
    "copper",
    "fluoride",
    "iodine",
    "iron",
    "magnesium",
    "manganese",
    "molybdenum",
    "phosphorus",
    "potassium",
    "selenium",
    "sodium",
    "zinc",
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

  useEffect(() => {
    if (location.pathname !== "/profile/setup") {
      setProfileMessage("");
    }
  }, [location.pathname]);

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
      setEmail("");
      setPassword("");
      setMessage("");
      navigate("/login");
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
        setMessage("");
        navigate("/welcome", { replace: true });
      } else {
        setAppStage("app");
        setMessage("");
        navigate("/", { replace: true });
      }
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

      setProfileAge("");
      setProfileSex("");
      setProfileHeight("");
      setProfileWeight("");
      setProfileActivity("");
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
    setEmail("");
    setPassword("");
    setProfile(null);

    setProfileAge("");
    setProfileSex("");
    setProfileHeight("");
    setProfileWeight("");
    setProfileActivity("");
    setProfileMessage("");

    setDays([]);
    setFoodHistory([]);
    setSelectedDay(null);
    setHistoryTab(null);

    setAddingMealId(null);
    setFoodName("");
    setFoodAmount("");
    setFoodUnit("g");
    setFoodMessage("");

    setIsEditingProfile(false);
    setRegistrationSuccess(false);

    setExpandedRemainingMealId(null);
    setExpandedRecommendation(null);
    setRecommendations([]);
    setShowAllRecommendations(false);
    setExpandedNutrientGroups({});

    setMessage("");
    navigate("/login", { replace: true });
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
    const age = Number(profileAge);
    const heightCm = Number(profileHeight);
    const weightKg = Number(profileWeight);

    if (
      !profileAge ||
      !profileSex ||
      !profileHeight ||
      !profileWeight ||
      !profileActivity
    ) {
      setProfileMessage("Please complete all profile fields.");
      return;
    }

    if (
      !Number.isFinite(age) ||
      !Number.isFinite(heightCm) ||
      !Number.isFinite(weightKg) ||
      age <= 0 ||
      heightCm <= 0 ||
      weightKg <= 0
    ) {
      setProfileMessage("Please enter valid profile values.");
      return;
    }

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
          age,
          sex: profileSex,
          heightCm,
          weightKg,
          activityLevel: profileActivity,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setProfileMessage(
        data.error === "Invalid profile data"
          ? "Please complete all profile fields with valid values."
          : data.error ?? "Failed to create profile",
      );
      return;
    }

    setProfileMessage("");
    setProfile(data.profile);
    setAppStage("app");
    setMessage("Profile created");
    navigate("/", { replace: true });
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

  if (appStage === "checkingSession") {
      return <p>Loading...</p>;
    }

  const defaultPath =
    appStage === "loggedOut"
      ? "/login"
      : appStage === "newUserWelcome"
        ? "/welcome"
        : "/";

  return (
    <div>
      {appStage === "app" && (
        <nav>
          <Link to="/">Home</Link> <Link to="/dashboard">Dashboard</Link>{" "}
          <button onClick={handleLogout}>Log out</button>
        </nav>
      )}

      {appStage === "app" &&
        location.pathname !== "/profile/setup" &&
        message && <p>{message}</p>}

      <Routes>
        <Route
          path="/login"
          element={
            appStage === "loggedOut" ? (
              <LoginPage
                email={email}
                password={password}
                message={message}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onLogin={handleLogin}
              />
            ) : (
              <Navigate to={defaultPath} replace />
            )
          }
        />

        <Route
          path="/register"
          element={
            appStage === "loggedOut" ? (
              <RegisterPage
                email={email}
                password={password}
                message={message}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onRegister={handleRegister}
              />
            ) : (
              <Navigate to={defaultPath} replace />
            )
          }
        />

        <Route
          path="/welcome"
          element={
            appStage === "newUserWelcome" ? (
              <div>
                <h2>Welcome to Daily Nutrition</h2>

                <p>Your account is ready.</p>

                <p>
                  Complete your profile to get personalized daily nutrition
                  targets, or skip for now and explore the app first.
                </p>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setAppStage("app");
                      navigate("/", { replace: true });
                    }}
                  >
                    Skip for now
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/profile/setup");
                    }}
                  >
                    Complete Profile
                  </button>
                </div>
              </div>
            ) : (
              <Navigate to={defaultPath} replace />
            )
          }
        />

        <Route
          path="/profile/setup"
          element={
            appStage === "loggedOut" ? (
              <Navigate to="/login" replace />
            ) : (
              <div>
                <h2>Complete your profile</h2>

                <p>
                  To calculate your personalized daily nutrition targets, please
                  complete your profile first.
                </p>

                {profileMessage && <p>{profileMessage}</p>}

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
                    Choose the option that best matches your usual daily
                    activity. If none fits exactly, select the closest one.
                  </p>

                  <label>
                    <input
                      type="radio"
                      name="activityLevel"
                      value="inactive"
                      checked={profileActivity === "inactive"}
                      onChange={(event) =>
                        setProfileActivity(event.target.value)
                      }
                    />

                    <span>
                      <strong>Inactive</strong>
                      <br />
                      Activities of daily living, such as about 30 minutes of
                      walking plus light-to-moderate household activity.
                    </span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="activityLevel"
                      value="lowActive"
                      checked={profileActivity === "lowActive"}
                      onChange={(event) =>
                        setProfileActivity(event.target.value)
                      }
                    />

                    <span>
                      <strong>Low active</strong>
                      <br />
                      Daily living activities plus about 60 to 80 minutes of
                      walking at 5 to 7 km/h.
                    </span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="activityLevel"
                      value="active"
                      checked={profileActivity === "active"}
                      onChange={(event) =>
                        setProfileActivity(event.target.value)
                      }
                    />

                    <span>
                      <strong>Active</strong>
                      <br />
                      Daily living activities plus additional moderate activity,
                      such as walking, cycling, and recreational sports.
                    </span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="activityLevel"
                      value="veryActive"
                      checked={profileActivity === "veryActive"}
                      onChange={(event) =>
                        setProfileActivity(event.target.value)
                      }
                    />

                    <span>
                      <strong>Very active</strong>
                      <br />
                      Daily living activities plus substantial additional
                      activity, such as cycling, jogging, and recreational
                      sports.
                    </span>
                  </label>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setAppStage("app");
                      navigate("/", { replace: true });
                    }}
                  >
                    Skip for now
                  </button>

                  <button onClick={handleCreateProfile}>Finish</button>
                </div>
              </div>
            )
          }
        />

        <Route
          path="/"
          element={
            appStage === "app" ? (
              <HomePage
                activeDayId={activeDayId}
                canStartNewDay={canStartNewDay}
                nowDayId={nowDayId}
                previousDayId={previousDayId}
                mealSessions={mealSessions}
                mealDetails={mealDetails}
                addingMealId={addingMealId}
                foodName={foodName}
                foodAmount={foodAmount}
                foodUnit={foodUnit}
                foodMessage={foodMessage}
                expandedRemainingMealId={expandedRemainingMealId}
                expandedRecommendation={expandedRecommendation}
                recommendations={recommendations}
                showAllRecommendations={showAllRecommendations}
                expandedNutrientGroups={expandedNutrientGroups}
                selectedDay={selectedDay}
                historyTab={historyTab}
                macronutrientPriority={macronutrientPriority}
                vitaminPriority={vitaminPriority}
                mineralPriority={mineralPriority}
                recommendationNutrientKeys={recommendationNutrientKeys}
                setAddingMealId={setAddingMealId}
                setFoodName={setFoodName}
                setFoodAmount={setFoodAmount}
                setFoodUnit={setFoodUnit}
                setExpandedRemainingMealId={setExpandedRemainingMealId}
                setExpandedRecommendation={setExpandedRecommendation}
                setRecommendations={setRecommendations}
                setShowAllRecommendations={setShowAllRecommendations}
                setHistoryTab={setHistoryTab}
                setSelectedDay={setSelectedDay}
                onStartNewDay={handleStartNewDay}
                onNewMeal={handleNewMeal}
                onDeleteMeal={handleDeleteMeal}
                onDeleteFood={handleDeleteFood}
                onAddFood={handleAddFood}
                onCancelAddFood={handleCancelAddFood}
                onFinishDay={handleFinishDay}
                onLoadDayDetails={loadDayDetails}
                onLoadRecommendations={loadRecommendations}
                onToggleNutrientGroup={toggleNutrientGroup}
                getDailyNeedText={getDailyNeedText}
                getNutrientDisplayName={getNutrientDisplayName}
                formatNumber={formatNumber}
              />
            ) : (
              <Navigate to={defaultPath} replace />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            appStage === "app" ? (
              <DashboardPage
                profile={profile}
                days={days}
                foodHistory={foodHistory}
                historyTab={historyTab}
                selectedDay={selectedDay}
                profileAge={profileAge}
                profileSex={profileSex}
                profileHeight={profileHeight}
                profileWeight={profileWeight}
                profileActivity={profileActivity}
                isEditingProfile={isEditingProfile}
                setProfileAge={setProfileAge}
                setProfileSex={setProfileSex}
                setProfileHeight={setProfileHeight}
                setProfileWeight={setProfileWeight}
                setProfileActivity={setProfileActivity}
                setIsEditingProfile={setIsEditingProfile}
                setHistoryTab={setHistoryTab}
                setSelectedDay={setSelectedDay}
                onUpdateProfile={handleUpdateProfile}
                onLoadDayDetails={loadDayDetails}
                onCompleteProfile={() => {
                  navigate("/profile/setup");
                }}
                getNutrientDisplayName={getNutrientDisplayName}
                formatNumber={formatNumber}
              />
            ) : (
              <Navigate to={defaultPath} replace />
            )
          }
        />

        <Route path="*" element={<Navigate to={defaultPath} replace />} />
      </Routes>
    </div>
  );
}

export default App;
