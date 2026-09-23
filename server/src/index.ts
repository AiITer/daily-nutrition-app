import express from "express";
import cors from "cors";
import "dotenv/config";
import { normalizeUsdaNutrients } from "./nutrition/normalizeUsdaNutrients.js";
import { calculateFoodIntake } from "./nutrition/calculateFoodIntake.js";
import { getDailyTarget } from "./nutrition/getDailyTarget.js";
import { compareIntakeToTarget } from "./nutrition/compareIntakeToTarget.js";
import { getFoodDensity } from "./nutrition/getFoodDensity.js";
import {
  convertFoodAmountToGrams,
  type FoodUnit,
} from "./nutrition/convertFoodAmountToGrams.js";
import { getDailyNutritionStatus } from "./nutrition/getDailyNutritionStatus.js";
import { getProfileByDaySession } from "./users/getProfileByDaySession.js";
import { createDaySession } from "./days/createDaySession.js";
import { getMealNutritionSummary } from "./nutrition/getMealNutritionSummary.js";
import { createFoodEntry } from "./foods/createFoodEntry.js";
import { processFood } from "./foods/processFood.js";
import { registerUser } from "./auth/registerUser.js";
import { loginUser } from "./auth/loginUser.js";
import { createToken } from "./auth/createToken.js";
import { requireAuth } from "./auth/requireAuth.js";
import {
  createProfile,
  type Sex,
  type ActivityLevel,
} from "./users/createProfile.js";
import { getNutritionStatusThroughMeal } from "./nutrition/getNutritionStatusThroughMeal.js";
import { getNutrientRecommendations } from "./recommendations/getNutrientRecommendations.js";
import { db } from "./db.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

function getLocalDateAndHour(timeZone: string, now = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(now);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return {
    localDate: `${values.year}-${values.month}-${values.day}`,
    localHour: Number(values.hour),
  };
}

function getPreviousDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00Z`);

  date.setUTCDate(date.getUTCDate() - 1);

  return date.toISOString().slice(0, 10);
}

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/recommendations/:nutrientKey", requireAuth, (req, res) => {
  const nutrientKey = req.params.nutrientKey;

  if (typeof nutrientKey !== "string") {
    return res.status(400).json({
      error: "Invalid nutrient key",
    });
  }

  const recommendations = getNutrientRecommendations(nutrientKey);

  if (!recommendations) {
    return res.status(404).json({
      error: "Recommendations not found for this nutrient",
    });
  }

  return res.json({
    nutrientKey,
    recommendations,
  });
});

app.get("/api/days/current", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;
    const timeZone = String(req.query.timeZone ?? "");

    if (!timeZone) {
      return res.status(400).json({
        error: "timeZone is required",
      });
    }

    const { localDate, localHour } = getLocalDateAndHour(timeZone);
    const previousDate = getPreviousDate(localDate);

    const activeResult = await db.query(
      `
        SELECT
          id,
          user_id,
          session_date,
          finished_at,
          created_at
        FROM day_sessions
        WHERE user_id = $1
          AND finished_at IS NULL
        ORDER BY session_date DESC
        LIMIT 1
        `,
      [userId],
    );

    let activeDay = activeResult.rows[0] ?? null;

    if (
      activeDay &&
      localHour >= 5 &&
      activeDay.session_date.toISOString().slice(0, 10) < localDate
    ) {
      const closeResult = await db.query(
        `
          UPDATE day_sessions
          SET finished_at = NOW()
          WHERE id = $1
          RETURNING
            id,
            user_id,
            session_date,
            finished_at,
            created_at
          `,
        [activeDay.id],
      );

      activeDay = null;
    }

    const todayResult = await db.query(
      `
        SELECT
          id,
          user_id,
          session_date,
          finished_at,
          created_at
        FROM day_sessions
        WHERE user_id = $1
          AND session_date = $2
        LIMIT 1
        `,
      [userId, localDate],
    );

    const nowDay = todayResult.rows[0] ?? null;

    const previousResult = await db.query(
      `
        SELECT
          id,
          user_id,
          session_date,
          finished_at,
          created_at
        FROM day_sessions
        WHERE user_id = $1
          AND session_date = $2
        LIMIT 1
        `,
      [userId, previousDate],
    );

    const previousDay = previousResult.rows[0] ?? null;

    const canStartNewDay = localHour >= 5 && nowDay === null;

    return res.json({
      localDate,
      localHour,
      activeDay,
      nowDay,
      previousDay,
      canStartNewDay,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load current day state",
    });
  }
});

app.get("/api/history/foods", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;

    const result = await db.query(
      `
        SELECT
          f.id,
          f.food_name,
          f.amount,
          f.unit,
          f.grams,
          f.created_at,
          d.session_date
        FROM food_entries f
        JOIN day_sessions d
          ON d.id = f.day_session_id
        WHERE d.user_id = $1
        ORDER BY f.created_at DESC
        `,
      [userId],
    );

    res.json({
      foods: result.rows,
    });
  } catch (error) {
    console.error("Failed to get food history:", error);

    res.status(500).json({
      error: "Failed to get food history",
    });
  }
});

app.get("/api/days", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;

    const result = await db.query(
      `
        SELECT
          id,
          session_date,
          created_at
        FROM day_sessions
        WHERE user_id = $1
        ORDER BY session_date DESC
        `,
      [userId],
    );

    res.json({
      days: result.rows,
    });
  } catch (error) {
    console.error("Failed to get day history:", error);

    res.status(500).json({
      error: "Failed to get day history",
    });
  }
});

app.get("/api/days/:daySessionId", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;
    const daySessionId = Number(req.params.daySessionId);

    if (!Number.isInteger(daySessionId)) {
      return res.status(400).json({
        error: "Invalid day session ID",
      });
    }

    const dayResult = await db.query(
      `
        SELECT id, session_date, created_at
        FROM day_sessions
        WHERE id = $1
          AND user_id = $2
        `,
      [daySessionId, userId],
    );

    const day = dayResult.rows[0];

    if (!day) {
      return res.status(404).json({
        error: "Day session not found",
      });
    }

    const foodResult = await db.query(
      `
        SELECT
          id,
          food_name,
          fdc_id,
          amount,
          unit,
          grams,
          nutrients,
          created_at
        FROM food_entries
        WHERE day_session_id = $1
        ORDER BY created_at ASC
        `,
      [daySessionId],
    );

    const profile = await getProfileByDaySession(daySessionId);

    if (!profile) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    const nutritionStatus = await getDailyNutritionStatus(daySessionId, {
      age: profile.age,
      sex: profile.sex,
      heightCm: profile.height_cm,
      weightKg: profile.weight_kg,
      activityLevel: profile.activity_level,
    });

    res.json({
      day,
      foods: foodResult.rows,
      nutritionStatus,
    });
  } catch (error) {
    console.error("Failed to get day details:", error);

    res.status(500).json({
      error: "Failed to get day details",
    });
  }
});

app.post("/api/days/:daySessionId/finish", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;
    const daySessionId = Number(req.params.daySessionId);

    const result = await db.query(
      `
        UPDATE day_sessions
        SET finished_at = NOW()
        WHERE id = $1
          AND user_id = $2
        RETURNING
          id,
          user_id,
          session_date,
          finished_at,
          created_at
        `,
      [daySessionId, userId],
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        error: "Day session not found",
      });
    }

    return res.json({
      daySession: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to finish day",
    });
  }
});

app.post(
  "/api/days/:daySessionId/meal-sessions",
  requireAuth,
  async (req, res) => {
    try {
      const userId = res.locals.userId;
      const daySessionId = Number(req.params.daySessionId);

      const dayResult = await db.query(
        `
        SELECT id
        FROM day_sessions
        WHERE id = $1 AND user_id = $2
        `,
        [daySessionId, userId],
      );

      if (!dayResult.rows[0]) {
        return res.status(404).json({
          error: "Day session not found",
        });
      }

      const mealSessionResult = await db.query(
        `
        INSERT INTO meal_sessions (day_session_id)
        VALUES ($1)
        RETURNING
          id,
          day_session_id,
          created_at
        `,
        [daySessionId],
      );

      return res.status(201).json({
        mealSession: mealSessionResult.rows[0],
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Failed to create meal session",
      });
    }
  },
);

app.get("/api/meal-sessions/:mealSessionId", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;
    const mealSessionId = Number(req.params.mealSessionId);

    const mealSessionResult = await db.query(
      `
        SELECT ms.*
        FROM meal_sessions ms
        JOIN day_sessions ds
          ON ms.day_session_id = ds.id
        WHERE ms.id = $1
          AND ds.user_id = $2
        `,
      [mealSessionId, userId],
    );

    if (!mealSessionResult.rows[0]) {
      return res.status(404).json({
        error: "Meal session not found",
      });
    }

    const foodsResult = await db.query(
      `
        SELECT
          id,
          day_session_id,
          meal_session_id,
          food_name,
          fdc_id,
          amount,
          unit,
          grams,
          created_at,
          nutrients
        FROM food_entries
        WHERE meal_session_id = $1
        ORDER BY created_at ASC
        `,
      [mealSessionId],
    );

    const nutrition = await getMealNutritionSummary(mealSessionId);

    const daySessionId = mealSessionResult.rows[0].day_session_id;

    const profileResult = await db.query(
      `
  SELECT
    age,
    sex,
    height_cm,
    weight_kg,
    activity_level
  FROM profiles
  WHERE user_id = $1
  `,
      [userId],
    );

    let currentNutritionStatus = null;
    let profile = null;

    if (profileResult.rows[0]) {
      const profileRow = profileResult.rows[0];

      profile = {
        age: profileRow.age,
        sex: profileRow.sex,
        heightCm: profileRow.height_cm,
        weightKg: profileRow.weight_kg,
        activityLevel: profileRow.activity_level,
      };
    }

    const nutritionStatusThroughMeal = profile
      ? await getNutritionStatusThroughMeal(mealSessionId, profile)
      : null;
    
    return res.json({
      mealSession: mealSessionResult.rows[0],
      foods: foodsResult.rows,
      nutrition,
      nutritionStatusThroughMeal,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load meal session",
    });
  }
});

app.get(
  "/api/days/:daySessionId/meal-sessions",
  requireAuth,
  async (req, res) => {
    try {
      const userId = res.locals.userId;
      const daySessionId = Number(req.params.daySessionId);

      const dayResult = await db.query(
        `
        SELECT id
        FROM day_sessions
        WHERE id = $1
          AND user_id = $2
        `,
        [daySessionId, userId],
      );

      if (!dayResult.rows[0]) {
        return res.status(404).json({
          error: "Day session not found",
        });
      }

      const mealSessionsResult = await db.query(
        `
        SELECT
          id,
          day_session_id,
          created_at
        FROM meal_sessions
        WHERE day_session_id = $1
        ORDER BY created_at ASC
        `,
        [daySessionId],
      );

      return res.json({
        mealSessions: mealSessionsResult.rows,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Failed to load meal sessions",
      });
    }
  },
);

app.get("/api/profile", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;

    const result = await db.query(
      `
        SELECT
          age,
          sex,
          height_cm,
          weight_kg,
          activity_level
        FROM profiles
        WHERE user_id = $1
        `,
      [userId],
    );

    const profile = result.rows[0];

    if (!profile) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    res.json({
      profile,
    });
  } catch (error) {
    console.error("Failed to get profile:", error);

    res.status(500).json({
      error: "Failed to get profile",
    });
  }
});

app.post("/api/profile", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;

    const { age, sex, heightCm, weightKg, activityLevel } = req.body;

    if (
      typeof age !== "number" ||
      typeof sex !== "string" ||
      typeof heightCm !== "number" ||
      typeof weightKg !== "number" ||
      typeof activityLevel !== "string"
    ) {
      return res.status(400).json({
        error: "Invalid profile data",
      });
    }

    const profile = await createProfile(
      userId,
      age,
      sex as Sex,
      heightCm,
      weightKg,
      activityLevel as ActivityLevel,
    );

    res.status(201).json({
      profile,
    });
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "Profile already exists",
      });
    }

    console.error("Failed to create profile:", error);

    res.status(500).json({
      error: "Failed to create profile",
    });
  }
});

app.put("/api/profile", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;

    const { age, sex, heightCm, weightKg, activityLevel } = req.body;

    if (
      typeof age !== "number" ||
      typeof sex !== "string" ||
      typeof heightCm !== "number" ||
      typeof weightKg !== "number" ||
      typeof activityLevel !== "string"
    ) {
      return res.status(400).json({
        error: "Invalid profile data",
      });
    }

    const result = await db.query(
      `
        UPDATE profiles
        SET
          age = $1,
          sex = $2,
          height_cm = $3,
          weight_kg = $4,
          activity_level = $5
        WHERE user_id = $6
        RETURNING *
        `,
      [age, sex, heightCm, weightKg, activityLevel, userId],
    );

    const profile = result.rows[0];

    if (!profile) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    res.json({
      profile,
    });
  } catch (error) {
    console.error("Failed to update profile:", error);

    res.status(500).json({
      error: "Failed to update profile",
    });
  }
});

app.get("/api/me", requireAuth, async (req, res) => {
  const userId = res.locals.userId;

  res.json({
    userId,
  });
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await loginUser(email.trim().toLowerCase(), password);

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = createToken(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.error("Failed to login:", error);

    res.status(500).json({
      error: "Failed to login",
    });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await registerUser(email.trim().toLowerCase(), password);

    res.status(201).json({
      user,
    });
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "Email is already registered",
      });
    }

    console.error("Failed to register user:", error);

    res.status(500).json({
      error: "Failed to register user",
    });
  }
});

app.post("/api/days/:daySessionId/foods", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;
    const daySessionId = Number(req.params.daySessionId);

    if (!Number.isInteger(daySessionId)) {
      return res.status(400).json({
        error: "Invalid day session ID",
      });
    }

    const dayResult = await db.query(
      `
  SELECT id
  FROM day_sessions
  WHERE id = $1
    AND user_id = $2
  `,
      [daySessionId, userId],
    );

    if (!dayResult.rows[0]) {
      return res.status(404).json({
        error: "Day session not found",
      });
    }

    const { foodName, amount, unit, mealSessionId } = req.body;

    const mealSessionResult = await db.query(
      `
  SELECT id
  FROM meal_sessions
  WHERE id = $1 AND day_session_id = $2
  `,
      [mealSessionId, daySessionId],
    );

    if (!mealSessionResult.rows[0]) {
      return res.status(404).json({
        error: "Meal session not found",
      });
    }

    if (
      typeof foodName !== "string" ||
      typeof amount !== "number" ||
      typeof unit !== "string" ||
      typeof mealSessionId !== "number"
    ) {
      return res.status(400).json({
        error: "foodName, amount, unit, and mealSessionId are required",
      });
    }

    const apiKey = process.env.USDA_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "USDA API key is not configured",
      });
    }

    const processedFood = await processFood(
      foodName,
      amount,
      unit as FoodUnit,
      apiKey,
    );

    const foodEntry = await createFoodEntry(
      daySessionId,
      mealSessionId,
      processedFood.foodName,
      processedFood.fdcId,
      processedFood.amount,
      processedFood.unit,
      processedFood.grams,
      processedFood.nutrients,
    );

    const dbProfile = await getProfileByDaySession(daySessionId);

    if (!dbProfile) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    const profile = {
      age: dbProfile.age,
      sex: dbProfile.sex,
      heightCm: dbProfile.height_cm,
      weightKg: dbProfile.weight_kg,
      activityLevel: dbProfile.activity_level,
    };

    const nutritionStatus = await getDailyNutritionStatus(
      daySessionId,
      profile,
    );

    res.status(201).json({
      foodEntry,
      nutritionStatus,
    });
  } catch (error) {
    console.error("Failed to add food:", error);

    res.status(500).json({
      error: "Failed to add food",
    });
  }
});

app.get("/api/foods/search", async (req, res) => {
  const query = req.query.q;

  if (typeof query !== "string" || !query.trim()) {
    return res.status(400).json({
      error: "Search query is required",
    });
  }

  const apiKey = process.env.USDA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "USDA API key is not configured",
    });
  }

  const url = new URL("https://api.nal.usda.gov/fdc/v1/foods/search");

  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("query", query);
  url.searchParams.set("pageSize", "60");

  const response = await fetch(url);
  console.log("USDA search request:", query);

  if (!response.ok) {
    return res.status(response.status).json({
      error: "Failed to search USDA foods",
    });
  }

  const data = await response.json();
  const foods = data.foods ?? [];

  function selectGenericFood(foods: any[], query: string, unit: string) {
    const normalizedQuery = query.toLowerCase().trim();

    const genericFoods = foods.filter((food: any) =>
      ["Foundation", "SR Legacy", "Survey (FNDDS)"].includes(food.dataType),
    );

    const startsWithQuery = genericFoods.filter((food: any) =>
      food.description?.toLowerCase().startsWith(normalizedQuery),
    );

    let candidates =
      startsWithQuery.length > 0 ? startsWithQuery : genericFoods;

    const needsDensity = unit !== "g";

    if (needsDensity) {
      const foodsWithDensity = candidates.filter(
        (food: any) => getFoodDensity(food.foodMeasures ?? []) !== null,
      );

      if (foodsWithDensity.length > 0) {
        candidates = foodsWithDensity;
      }
    }

    const dataTypePriority: Record<string, number> = {
      Foundation: 1,
      "SR Legacy": 2,
      "Survey (FNDDS)": 3,
    };

    return candidates.sort((a: any, b: any) => {
      const typeDifference =
        (dataTypePriority[a.dataType] ?? 999) -
        (dataTypePriority[b.dataType] ?? 999);

      if (typeDifference !== 0) {
        return typeDifference;
      }

      return a.description.length - b.description.length;
    })[0];
  }

  const amount = Number(req.query.amount) || 100;

  const unit = typeof req.query.unit === "string" ? req.query.unit : "g";

  const selectedFood = selectGenericFood(foods, query, unit);
  if (!selectedFood) {
    return res.status(404).json({
      error: "No suitable generic food found",
    });
  }

  const nutrients = normalizeUsdaNutrients(selectedFood.foodNutrients ?? []);

  const density =
    unit === "g" ? undefined : getFoodDensity(selectedFood.foodMeasures ?? []);

  const grams = convertFoodAmountToGrams(
    amount,
    unit as FoodUnit,
    density ?? undefined,
  );

  if (grams === null) {
    return res.status(400).json({
      error: "Unable to convert this food from volume. Please enter grams.",
    });
  }

  const intake = calculateFoodIntake(nutrients, grams);

  const testProfile = {
    age: 35,
    sex: "female" as const,
    heightCm: 165,
    weightKg: 60,
    activityLevel: "active" as const,
  };

  const nutritionSummary = intake.map((item) => {
    const target = getDailyTarget(item.nutrientKey, testProfile);

    return compareIntakeToTarget(item, target);
  });

  res.json({
    name: query.trim(),
    amount,
    unit,
    grams,
    density,
    fdcId: selectedFood.fdcId,
    usdaDescription: selectedFood.description,
    nutrients: nutritionSummary,
  });
});

app.delete("/api/foods/:foodEntryId", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;
    const foodEntryId = Number(req.params.foodEntryId);

    const result = await db.query(
      `
        DELETE FROM food_entries
        USING day_sessions
        WHERE food_entries.id = $1
          AND food_entries.day_session_id = day_sessions.id
          AND day_sessions.user_id = $2
          AND day_sessions.finished_at IS NULL
        RETURNING food_entries.id
        `,
      [foodEntryId, userId],
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        error: "Food entry not found or day is already finished",
      });
    }

    return res.json({
      deletedFoodEntryId: result.rows[0].id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to delete food",
    });
  }
});

app.delete(
  "/api/meal-sessions/:mealSessionId",
  requireAuth,
  async (req, res) => {
    try {
      const userId = res.locals.userId;
      const mealSessionId = Number(req.params.mealSessionId);

      const result = await db.query(
        `
          DELETE FROM meal_sessions
          USING day_sessions
          WHERE meal_sessions.id = $1
            AND meal_sessions.day_session_id = day_sessions.id
            AND day_sessions.user_id = $2
            AND day_sessions.finished_at IS NULL
          RETURNING meal_sessions.id
        `,
        [mealSessionId, userId],
      );

      if (!result.rows[0]) {
        return res.status(404).json({
          error: "Meal not found or day is already finished",
        });
      }

      return res.json({
        deletedMealSessionId: result.rows[0].id,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Failed to delete meal",
      });
    }
  },
);

app.get("/api/days/:daySessionId/nutrition", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;
    const daySessionId = Number(req.params.daySessionId);

    if (!Number.isInteger(daySessionId)) {
      return res.status(400).json({
        error: "Invalid day session ID",
      });
    }

    const dayResult = await db.query(
      `
  SELECT id
  FROM day_sessions
  WHERE id = $1
    AND user_id = $2
  `,
      [daySessionId, userId],
    );

    if (!dayResult.rows[0]) {
      return res.status(404).json({
        error: "Day session not found",
      });
    }

    const dbProfile = await getProfileByDaySession(daySessionId);

    if (!dbProfile) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    const profile = {
      age: dbProfile.age,
      sex: dbProfile.sex,
      heightCm: dbProfile.height_cm,
      weightKg: dbProfile.weight_kg,
      activityLevel: dbProfile.activity_level,
    };

    const nutritionStatus = await getDailyNutritionStatus(
      daySessionId,
      profile,
    );

    res.json({
      daySessionId,
      nutrients: nutritionStatus,
    });
  } catch (error) {
    console.error("Failed to get daily nutrition status:", error);

    res.status(500).json({
      error: "Failed to get daily nutrition status",
    });
  }
});

app.post("/api/days", requireAuth, async (req, res) => {
  try {
    const userId = res.locals.userId;

    const timeZone = String(req.body.timeZone ?? "");
    if (!timeZone) {
      return res.status(400).json({
        error: "timeZone is required",
      });
    }

    const { localDate, localHour } = getLocalDateAndHour(timeZone);

    if (localHour < 5) {
      return res.status(400).json({
        error: "A new day cannot be started before 5 AM local time",
      });
    }

    const sessionDate = localDate;

    const daySession = await createDaySession(userId, sessionDate);

    res.status(201).json(daySession);
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "Day session already exists for this date",
      });
    }

    console.error("Failed to create day session:", error);

    res.status(500).json({
      error: "Failed to create day session",
    });
  }
});

app.get("/api/debug/usda", async (req, res) => {
  const query = req.query.q;

  if (typeof query !== "string" || !query.trim()) {
    return res.status(400).json({
      error: "Search query is required",
    });
  }

  const apiKey = process.env.USDA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "USDA API key is not configured",
    });
  }

  const url = new URL("https://api.nal.usda.gov/fdc/v1/foods/search");

  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("query", query);
  url.searchParams.set("pageSize", "10");

  const response = await fetch(
    "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=" + apiKey,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        pageSize: 20,
        dataType: ["Foundation", "SR Legacy", "Survey (FNDDS)"],
      }),
    },
  );

  if (!response.ok) {
    return res.status(response.status).json({
      error: "USDA request failed",
    });
  }

  const data = await response.json();

  const results = (data.foods ?? []).map((food: any) => ({
    fdcId: food.fdcId,
    description: food.description,
    dataType: food.dataType,
    foodMeasures: food.foodMeasures ?? [],
    nutrients: (food.foodNutrients ?? []).map((nutrient: any) => ({
      id: nutrient.nutrientId,
      name: nutrient.nutrientName,
      unit: nutrient.unitName,
      value: nutrient.value,
    })),
  }));

  res.json(results);
});

app.get("/api/debug/usda/:fdcId", async (req, res) => {
  const apiKey = process.env.USDA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "USDA API key is not configured",
    });
  }

  const { fdcId } = req.params;

  const url = new URL(`https://api.nal.usda.gov/fdc/v1/food/${fdcId}`);

  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    return res.status(response.status).json({
      error: "USDA food details request failed",
    });
  }

  const data = await response.json();

  res.json({
    fdcId: data.fdcId,
    description: data.description,
    dataType: data.dataType,
    servingSize: data.servingSize,
    servingSizeUnit: data.servingSizeUnit,
    foodPortions: data.foodPortions ?? [],
    foodMeasures: data.foodMeasures ?? [],
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
