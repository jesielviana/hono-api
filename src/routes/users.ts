import { Prisma } from "@prisma/client";
import { Context, Hono } from "hono";
import prisma from "../config/prisma";
import UserRepostitory from "../repositories/UserRepostitory";
import { getLoggedUserId } from "../util/utils";

const usersRoute = new Hono();
const userRepostitory = new UserRepostitory(prisma);

usersRoute.get("/", async (c: Context) => {
  const users = await userRepostitory.findAll();
  return c.json(users);
});

usersRoute.get("/:id{[0-9]+}", async (c) => {
  console.log(c.req.param("id"));
  let id = Number(c.req.param("id"));
  const user = await userRepostitory.findById(id);
  return c.json(user);
});

usersRoute.put("/me", async (c) => {
  const userLoggedId = getLoggedUserId(c);
  
});

usersRoute.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, password } = body;
    const userByEmail = await prisma.user.findFirst({
      where: { email },
    });
    if (userByEmail) {
      c.status(400);
      return c.json({});
    }
    const cryptPassword = await Bun.password.hash(password);
    const user: Prisma.UserCreateInput = {
      name,
      email,
      password: cryptPassword,
    };
    const newUser = await prisma.user.create({ data: user });
    c.status(201);
    return c.json(newUser);
  } catch (error) {
    console.error(error);
    c.status(400);
    return c.json({ error: error });
  }
});

export default usersRoute;
