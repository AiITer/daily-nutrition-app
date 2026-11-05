import { describe, expect, it } from "vitest";
import { isValidEmail, normalizeEmail } from "./validateEmail.js";

describe("normalizeEmail", () => {
  it("trims spaces and converts email to lowercase", () => {
    expect(normalizeEmail("  Luna@Example.COM  ")).toBe("luna@example.com");
  });
});

describe("isValidEmail", () => {
  it.each([
    "luna@example.com",
    "test.user@example.ca",
    "user123@sub.example.com",
  ])("accepts valid email: %s", (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each([
    "testexample.com",
    "test@example",
    "@example.com",
    "test@.com",
    "test @example.com",
    "test@example .com",
    "",
  ])("rejects invalid email: %s", (email) => {
    expect(isValidEmail(email)).toBe(false);
  });
});
