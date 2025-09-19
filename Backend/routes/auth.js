const request = require("supertest");
const express = require("express");
const authRouter = require("../routes/authRoutes");

const app = express();
app.use(express.json());
app.use("/auth", authRouter);

describe("Auth Routes", () => {
  test("POST /auth/register should register a user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "testuser", password: "secret" });

    expect(res.status).toBe(201); // expect 201 Created
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

  test("POST /auth/login should login a user", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "secret" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
