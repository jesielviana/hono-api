import { Movie, Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import { Context, Hono } from "hono";

const moviesRoute = new Hono();

moviesRoute.get("/", async (c: Context) => {
  const movies = await prisma.movie.findMany();
  return c.json(movies);
});

moviesRoute.get("/:id{[0-9]+}", async (c) => {
  console.log(c.req.param("id"));
  let id = Number(c.req.param("id"));
  const movies = await prisma.movie.findUnique({
    where: { id },
  });
  return c.json(movies);
});

moviesRoute.post("/", async (c) => {
  const body = await c.req.json();
  const { title, description, releaseYear } = body;
  const userLoggedId = getLoggedUserId(c);
  const movie: Prisma.MovieCreateInput = {
    title,
    description,
    releaseYear,
    updatedAt: new Date(),
    user: userLoggedId,
  };
  const newMovie = await prisma.movie.create({ data: movie });
  c.status(201);
  return c.json(newMovie);
});

moviesRoute.put("/:id{[0-9]+}", async (c) => {
  let id = Number(c.req.param("id"));
  const userLoggedId = getLoggedUserId(c);
  const body = await c.req.json();
  const { title, description, releaseYear, userId } = body;

  if (userLoggedId != userId) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }
  const movie: Prisma.MovieUpdateInput = {
    title,
    description,
    releaseYear,
    updatedAt: new Date(),
  };
  const movieUpdated = await prisma.movie.update({
    where: { id },
    data: movie,
  });
  return c.json(movieUpdated);
});

moviesRoute.delete("/:id{[0-9]+}", async (c) => {
  let id = Number(c.req.param("id"));
  const movieDeleted = await prisma.movie.delete({
    where: {
      id,
    },
  });
  return c.json(movieDeleted);
});

function getLoggedUserId(c: Context) {
  return c.get("jwtPayload").id;
}

export default moviesRoute;
