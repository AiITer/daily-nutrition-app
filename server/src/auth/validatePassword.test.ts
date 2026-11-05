import { describe, expect, it } from "vitest";
import { getPasswordStrength, validatePassword } from "./validatePassword.js";

describe("getPasswordStrength", () => {
  it("returns weak for an empty password", () => {
    expect(getPasswordStrength("")).toBe("weak");
  });

  it("returns weak for a password shorter than 8 characters even with multiple character types", () => {
    expect(getPasswordStrength("Ab12!xy")).toBe("weak");
  });

  it.each([
    {
      name: "lowercase only",
      password: "abcdefgh",
    },
    {
      name: "uppercase only",
      password: "ABCDEFGH",
    },
    {
      name: "numbers only",
      password: "12345678",
    },
    {
      name: "special characters only",
      password: "!@#$%^&*",
    },
  ])("returns weak for $name", ({ password }) => {
    expect(getPasswordStrength(password)).toBe("weak");
  });

  it.each([
    {
      name: "lowercase + uppercase",
      password: "abcdEFGH",
    },
    {
      name: "lowercase + numbers",
      password: "abcd1234",
    },
    {
      name: "lowercase + special characters",
      password: "abcd!@#$",
    },
    {
      name: "uppercase + numbers",
      password: "ABCD1234",
    },
    {
      name: "uppercase + special characters",
      password: "ABCD!@#$",
    },
    {
      name: "numbers + special characters",
      password: "1234!@#$",
    },
  ])("returns medium for $name", ({ password }) => {
    expect(getPasswordStrength(password)).toBe("medium");
  });

  it.each([
    {
      name: "lowercase + uppercase + numbers",
      password: "Abcd1234",
    },
    {
      name: "lowercase + uppercase + special characters",
      password: "Abcd!@#$",
    },
    {
      name: "lowercase + numbers + special characters",
      password: "abcd12!@",
    },
    {
      name: "uppercase + numbers + special characters",
      password: "ABCD12!@",
    },
    {
      name: "all four character types",
      password: "Abcd12!@",
    },
  ])("returns strong for $name", ({ password }) => {
    expect(getPasswordStrength(password)).toBe("strong");
  });
});

describe("validatePassword", () => {
  it("returns a length error for passwords shorter than 8 characters", () => {
    expect(validatePassword("Ab12!xy")).toBe(
      "Password must be at least 8 characters long.",
    );
  });

  it("returns a weak-password error for passwords with only one character type", () => {
    expect(validatePassword("abcdefgh")).toBe(
      "Password is too weak. Use a mix of letters, numbers, or special characters.",
    );
  });

  it("accepts a medium-strength password", () => {
    expect(validatePassword("abcd1234")).toBeNull();
  });

  it("accepts a strong password", () => {
    expect(validatePassword("Abcd1234")).toBeNull();
  });
});
