import { Hono } from "hono";
import { Movie } from "../types/types";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const movies: Movie[] = [];

export const moviesRoute = new OpenAPIHono();

moviesRoute.get("/", (c) => {
  return c.json(movies);
});

moviesRoute.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: {
      200: {
        description: "Respond a message",
        content: {
          "application/json": {
            schema: z.array(z.object({ name: z.string(), year: z.number() })),
          },
        },
      },
    },
  }),
  (c) => {
    return c.json(movies);
  },
);

moviesRoute.post("/", async (c) => {
  const body = await c.req.json();
  const { name, year } = body;
  const movie: Movie = { name, year, updatedAt: new Date() };
  movies.push(movie);
  return c.json(movie);
});
