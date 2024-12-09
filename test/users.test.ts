import { describe, expect, test } from "bun:test";

import app from "../src/app";

// https://stackoverflow.com/questions/75486253/creating-a-test-database-with-prisma

describe("/api/users", () => {
  test("deve retornar uma lista vazia", async () => {
    const res = await app.request("/api/users");
    const users = await res.json();
    console.log(users);
    expect(res.status).toBe(200);
  });

  test("deve retornar cadastrar um novo usuário", async () => {
    const res = await app.request("/api/users", {
      method: "POST",
      body: JSON.stringify({
        name: "Jesiel",
        email: "jesiel@email.com",
        password: "123456",
      }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    const users = await res.json();
    expect(res.status).toBe(201);
  });
});
