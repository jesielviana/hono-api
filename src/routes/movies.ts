import { Hono } from "hono";
import { Movie, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type MovieCreateInput = Omit<Movie, "id">;

export const moviesRoute = new Hono();

moviesRoute.get("/", async (c) => {
  const movies = await prisma.movie.findMany();
  return c.json(movies);
});

moviesRoute.post("/", async (c) => {
  const body = await c.req.json();
  const { title, description, releaseYear } = body;
  const movie: MovieCreateInput = { title, description, releaseYear, updatedAt: new Date() };
  await prisma.movie.create({ data: movie });
  return c.json(movie);
});
