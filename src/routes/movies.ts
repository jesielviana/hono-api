import { Hono, Context } from "hono";
import { Movie } from "@prisma/client";
import prisma from "../config/prisma";

type MovieCreateInput = Omit<Movie, "id">;

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
  const movie: MovieCreateInput = { title, description, releaseYear, updatedAt: new Date() };
  const newMovie = await prisma.movie.create({ data: movie });
  c.status(201);
  return c.json(newMovie);
});

moviesRoute.put("/:id{[0-9]+}", async (c) => {
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

moviesRoute.delete("/:id{[0-9]+}", async (c) => {
  let id = Number(c.req.param("id"));
  const movieDeleted = await prisma.movie.delete({
    where: {
      id,
    },
  });
  return c.json(movieDeleted);
});

export default moviesRoute;
