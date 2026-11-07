import request from "supertest";
import { describe, expect, it, vi } from "vitest";

import { app } from "../index.js";
import { registerUser } from "./registerUser.js";
import { loginUser } from "./loginUser.js";
import { createToken } from "./createToken.js";

vi.mock("./registerUser.js");
vi.mock("./loginUser.js");
vi.mock("./createToken.js");

describe("POST /api/auth/register", () => {
  it("returns 400 when password is missing", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "luna@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Email and password are required");
  });

  it("returns 400 for an invalid email", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "luna@example",
      password: "Abcd1234",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Please enter a valid email address.");
  });

  it("returns 400 for a weak password", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "luna@example.com",
      password: "abcdefgh",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Password is too weak. Use a mix of letters, numbers, or special characters.",
    );
  });

  it("registers a valid user and normalizes the email", async () => {
    vi.mocked(registerUser).mockResolvedValue({
      id: 1,
      email: "luna@example.com",
      created_at: new Date(),
    });

    const response = await request(app).post("/api/auth/register").send({
      email: "  Luna@Example.COM  ",
      password: "Abcd1234",
    });

    expect(response.status).toBe(201);

    expect(registerUser).toHaveBeenCalledWith("luna@example.com", "Abcd1234");
  });

  it("returns 409 when the email is already registered", async () => {
    vi.mocked(registerUser).mockRejectedValue({
      code: "23505",
    });

    const response = await request(app).post("/api/auth/register").send({
      email: "luna@example.com",
      password: "Abcd1234",
    });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Email is already registered");
  });
});

describe("POST /api/auth/login", () => {
  it("returns 401 for invalid credentials", async () => {
    vi.mocked(loginUser).mockResolvedValue(null);

    const response = await request(app).post("/api/auth/login").send({
      email: "luna@example.com",
      password: "Wrong123",
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid email or password");
  });

  it("logs in a valid user and returns a token", async () => {
    vi.mocked(loginUser).mockResolvedValue({
      id: 1,
      email: "luna@example.com",
      created_at: new Date(),
    });

    vi.mocked(createToken).mockReturnValue("test-token");

    const response = await request(app).post("/api/auth/login").send({
      email: "  Luna@Example.COM  ",
      password: "Abcd1234",
    });

    expect(response.status).toBe(200);

    expect(loginUser).toHaveBeenCalledWith("luna@example.com", "Abcd1234");

    expect(response.body.token).toBe("test-token");
  });
});