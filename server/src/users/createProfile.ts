import { db } from "../db.js";

type Sex = "female" | "male";

type ActivityLevel = "inactive" | "lowActive" | "active" | "veryActive";

export async function createProfile(
  userId: number,
  age: number,
  sex: Sex,
  heightCm: number,
  weightKg: number,
  activityLevel: ActivityLevel,
) {
  const result = await db.query(
    `
    INSERT INTO profiles (
      user_id,
      age,
      sex,
      height_cm,
      weight_kg,
      activity_level
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [userId, age, sex, heightCm, weightKg, activityLevel],
  );

  return result.rows[0];
}
