import { User } from "@prisma/client";
import { beforeAll, beforeEach, describe, expect, test } from "bun:test";
import app from "../src/app";
import prisma from "../src/config/prisma";

beforeAll(() => {
  console.log("beforeAll");
});
beforeEach(() => {
  console.log("beforeEach");
  prisma.user.deleteMany({});
});

const defaultUser = {
  name: "User defaul",
  email: "userdefault@email.com",
  password: "12345",
};

describe("get usuários /api/users", () => {
  test("deve retornar uma lista de usuários vazia", async () => {
    const res = await app.request("/api/users");
    expect(res.status).toBe(200);
    const users = await res.json();
    expect(users.length).toBe(0);
  });
});

describe("post usuários /api/users", () => {
  test("deve retornar cadastrar um novo usuário", async () => {
    const res = await app.request("/api/users", {
      method: "POST",
      body: JSON.stringify(defaultUser),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    expect(res.status).toBe(201);
    const user: User = await res.json();
    expect(user.name).toBe(defaultUser.name);
  });
  test("deve retornar email ja cadastrado", async () => {
    const res1 = await app.request("/api/users", {
      method: "POST",
      body: JSON.stringify(defaultUser),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    const res = await app.request("/api/users", {
      method: "POST",
      body: JSON.stringify(defaultUser),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    expect(res.status).toBe(400);
  });
});
