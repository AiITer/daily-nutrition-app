import "dotenv/config";
import { db } from "./db.js";
import { createUser } from "./users/createUser.js";
import { createProfile } from "./users/createProfile.js";

async function testCreateAccount() {
  try {
    const user = await createUser("test3@example.com", "temporary_hash");

    const profile = await createProfile(
      user.id,
      35,
      "female",
      165,
      60,
      "active",
    );

    console.log("User:", user);
    console.log("Profile:", profile);
  } catch (error) {
    console.error("Failed to create account:", error);
  } finally {
    await db.end();
  }
}

testCreateAccount();
