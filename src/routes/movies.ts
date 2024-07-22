import { Hono } from "hono";
import { Movie, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type MovieCreateInput = Omit<Movie, "id">;

export const moviesRoute = new Hono();

moviesRoute.get("/", async (c) => {
  const movies = await prisma.movie.findMany();
  return c.json(movies);
});

moviesRoute.get("/:id", async (c) => {
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
  const movie: MovieCreateInput = { title, description, releaseYear, updatedAt: new Date() };
  const newMovie = await prisma.movie.create({ data: movie });
  c.status(201);
  return c.json(newMovie);
});

moviesRoute.put("/:id", async (c) => {
  let id = Number(c.req.param("id"));
  const body = await c.req.json();
  const { title, description, releaseYear } = body;
  const movie: Movie = { id, title, description, releaseYear, updatedAt: new Date() };
  const movieUpdated = await prisma.movie.update({
    where: { id },
    data: movie,
  });
  return c.json(movieUpdated);
});

moviesRoute.delete("/:id", async (c) => {
  let id = Number(c.req.param("id"));
  const movieDeleted = await prisma.movie.delete({
    where: {
      id,
    },
  });
  return c.json(movieDeleted);
});
