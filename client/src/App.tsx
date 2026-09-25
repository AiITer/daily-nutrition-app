import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WelcomePage from "./pages/WelcomePage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";

type AppStage = "checkingSession" | "loggedOut" | "newUserWelcome" | "app";

type RecommendationSection = "nutrition" | "remaining";

function formatNumber(value: number | string) {
  return Number(Number(value).toFixed(2));
}

function getWelcomeDismissedKey(email: string) {
  return `daily-nutrition:welcome-dismissed:${email.trim().toLowerCase()}`;
}

function isWelcomeDismissed(email: string) {
  return (
    Boolean(email) &&
    localStorage.getItem(getWelcomeDismissedKey(email)) === "true"
  );
}

function markWelcomeDismissed(email: string) {
  if (!email) {
    return;
  }

  localStorage.setItem(getWelcomeDismissedKey(email), "true");
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
  const [accountEmail, setAccountEmail] = useState("");
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

        const meData = await response.json();
        const restoredEmail = meData.email ?? "";
        setAccountEmail(restoredEmail);

        const loadedProfile = await loadUserData(token);

        // Profile setup is URL-driven: refreshing it must stay on that page.
        // If the user is still onboarding, keep the onboarding stage too,
        // so browser Back returns to /welcome instead of being redirected home.
        if (location.pathname === "/profile/setup") {
          if (loadedProfile === null && !isWelcomeDismissed(restoredEmail)) {
            setAppStage("newUserWelcome");
          } else {
            setAppStage("app");
          }

          return;
        }

        // A user without a profile keeps seeing Welcome until they explicitly
        // choose "Skip for now" or finish creating a profile.
        if (loadedProfile === null && !isWelcomeDismissed(restoredEmail)) {
          setAppStage("newUserWelcome");

          if (location.pathname !== "/welcome") {
            navigate("/welcome", { replace: true });
          }

          return;
        }

        setAppStage("app");

        // If Welcome is no longer applicable, do not leave a stale /welcome URL.
        if (location.pathname === "/welcome") {
          navigate("/", { replace: true });
        }
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

      const registeredEmail = email.trim().toLowerCase();
      localStorage.removeItem(getWelcomeDismissedKey(registeredEmail));

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

      const loggedInEmail = data.user?.email ?? email.trim().toLowerCase();

      setAccountEmail(loggedInEmail);

      const loadedProfile = await loadUserData(data.token);

      const shouldShowWelcome =
        registrationSuccess ||
        (loadedProfile === null && !isWelcomeDismissed(loggedInEmail));

      setRegistrationSuccess(false);
      setMessage("");

      if (shouldShowWelcome) {
        setAppStage("newUserWelcome");
        navigate("/welcome", { replace: true });
      } else {
        setAppStage("app");
        navigate("/", { replace: true });
      }
    } catch {
      setMessage("Login failed");
    }
  }

  async function loadUserData(token: string) {
    let loadedProfile: any | null = null;

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

      loadedProfile = profileData.profile;
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

    if (currentDayResponse.ok) {
      setCanStartNewDay(currentDayData.canStartNewDay);
      setNowDayId(currentDayData.nowDay ? currentDayData.nowDay.id : null);
      setPreviousDayId(
        currentDayData.previousDay ? currentDayData.previousDay.id : null,
      );

      if (currentDayData.activeDay) {
        setActiveDayId(currentDayData.activeDay.id);
        await loadMealSessions(currentDayData.activeDay.id);
      } else {
        setActiveDayId(null);
        setMealSessions([]);
        setMealDetails({});
      }
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

    return loadedProfile;
  }

  function handleLogout() {
    localStorage.removeItem("token");

    setAppStage("loggedOut");
    setEmail("");
    setAccountEmail("");
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

    if (profileAge && (!Number.isInteger(age) || age < 1 || age > 120)) {
      setProfileMessage("Please enter a valid age, height, and weight.");
      return;
    }

    if (
      profileHeight &&
      (!Number.isFinite(heightCm) || heightCm < 40 || heightCm > 250)
    ) {
      setProfileMessage("Please enter a valid age, height, and weight.");
      return;
    }

    if (
      profileWeight &&
      (!Number.isFinite(weightKg) || weightKg < 2 || weightKg > 300)
    ) {
      setProfileMessage("Please enter a valid age, height, and weight.");
      return;
    }

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
          ? "Please check the profile fields and try again."
          : (data.error ?? "Failed to create profile"),
      );
      return;
    }

    setProfileMessage("");
    setProfile(data.profile);
    markWelcomeDismissed(accountEmail);
    setAppStage("app");
    setMessage("");
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
    setMessage("");
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

    setMessage("");
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

    setMessage("");
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

    setMessage("");
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

    setMessage("");
  }

  async function handleUpdateProfile() {
    const age = Number(profileAge);
    const heightCm = Number(profileHeight);
    const weightKg = Number(profileWeight);

    if (
      !Number.isInteger(age) ||
      age < 1 ||
      age > 120 ||
      !Number.isFinite(heightCm) ||
      heightCm < 40 ||
      heightCm > 250 ||
      !Number.isFinite(weightKg) ||
      weightKg < 2 ||
      weightKg > 300
    ) {
      setMessage("");
      setProfileMessage("Please enter a valid age, height, and weight.");
      return;
    }

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
      setMessage("");
      setProfileMessage(data.error ?? "Failed to update profile");
      return;
    }

    setProfileMessage("");
    setProfile(data.profile);
    setIsEditingProfile(false);
    setMessage("");
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
      {appStage === "app" && location.pathname !== "/profile/setup" && (
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
              <WelcomePage
                onSkip={() => {
                  markWelcomeDismissed(accountEmail);
                  setAppStage("app");
                  navigate("/", { replace: true });
                }}
                onCompleteProfile={() => {
                  navigate("/profile/setup");
                }}
                onBackToLogin={handleLogout}
              />
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
              <CompleteProfilePage
                age={profileAge}
                sex={profileSex}
                height={profileHeight}
                weight={profileWeight}
                activity={profileActivity}
                message={profileMessage}
                onAgeChange={setProfileAge}
                onSexChange={setProfileSex}
                onHeightChange={setProfileHeight}
                onWeightChange={setProfileWeight}
                onActivityChange={setProfileActivity}
                onClearMessage={() => setProfileMessage("")}
                onSkip={() => {
                  markWelcomeDismissed(accountEmail);
                  setAppStage("app");
                  navigate("/", { replace: true });
                }}
                onFinish={handleCreateProfile}
              />
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
                accountEmail={accountEmail}
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
                profileMessage={profileMessage}
                setProfileAge={setProfileAge}
                setProfileSex={setProfileSex}
                setProfileHeight={setProfileHeight}
                setProfileWeight={setProfileWeight}
                setProfileActivity={setProfileActivity}
                setIsEditingProfile={setIsEditingProfile}
                setProfileMessage={setProfileMessage}
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
