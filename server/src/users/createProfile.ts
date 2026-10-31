import { db } from "../db.js";

export type Sex = "female" | "male";

export type ActivityLevel = "inactive" | "lowActive" | "active" | "veryActive";

export async function createProfile(
  userId: number,
  displayName: string | null,
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
      display_name,
      age,
      sex,
      height_cm,
      weight_kg,
      activity_level
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [userId, displayName, age, sex, heightCm, weightKg, activityLevel],
  );

  return result.rows[0];
}
