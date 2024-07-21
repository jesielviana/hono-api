import { Hono } from "hono";
import { logger } from "hono/logger";
import { moviesRoute } from "./routes/movies";
import { cors } from "hono/cors";
import { swaggerUI } from "@hono/swagger-ui";

import swagger from "../swagger.json";

const app = new Hono().basePath("/api").route("/movies", moviesRoute);

app.get("/doc", swaggerUI({ url: "/api/swagger" }));

app.use(cors());
app.use(logger());

app.get("/", (c) => {
  return c.text("Api Online!");
});

app.get("/swagger", (c) => {
  return c.json(swagger);
});

app.notFound((c) => {
  return c.text("Rota inválida", 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("Erro interno", 500);
});

export default app;
