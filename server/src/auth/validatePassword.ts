export type PasswordStrength = "weak" | "medium" | "strong";

export function getPasswordStrength(password: string): PasswordStrength {
  let characterTypes = 0;

  if (/[a-z]/.test(password)) {
    characterTypes++;
  }

  if (/[A-Z]/.test(password)) {
    characterTypes++;
  }

  if (/[0-9]/.test(password)) {
    characterTypes++;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    characterTypes++;
  }

  if (password.length < 8 || characterTypes <= 1) {
    return "weak";
  }

  if (characterTypes <= 3) {
    return "medium";
  }

  return "strong";
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  const strength = getPasswordStrength(password);

  if (strength === "weak") {
    return "Password is too weak. Use a mix of letters, numbers, or special characters.";
  }

  return null;
}
