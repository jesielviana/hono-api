import { Prisma, User } from "@prisma/client";
import { Context, Hono } from "hono";
import prisma from "../config/prisma";
import UserRepostitory from "../repositories/UserRepostitory";

const usersRoute = new Hono();
const userRepostitory = new UserRepostitory(prisma);

usersRoute.get("/", async (c: Context) => {
  const users = await userRepostitory.findAll();
  // const users = await prisma.user.findMany({
  //   omit: { password: true },
  // });
  return c.json(users);
});

usersRoute.get("/:id{[0-9]+}", async (c) => {
  console.log(c.req.param("id"));
  let id = Number(c.req.param("id"));
  // const user = await prisma.user.findUnique({
  //   where: { id },
  //   include: { movies: true },
  // });
  const user = await userRepostitory.findById(id);
  return c.json(user);
});

usersRoute.post("/", async (c) => {
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
  const user: Prisma.UserCreateInput = { name, email, password: cryptPassword };
  const newUser = await prisma.user.create({ data: user });
  c.status(201);
  return c.json(newUser);
});

export default usersRoute;
