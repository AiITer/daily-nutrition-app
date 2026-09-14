import bcrypt from "bcrypt";
import { createUser } from "../users/createUser.js";

export async function registerUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);

  return createUser(email, passwordHash);
}
