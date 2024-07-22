import { Hono } from "hono";
import { logger } from "hono/logger";
import { moviesRoute } from "./routes/movies";
import { cors } from "hono/cors";
import { swaggerUI } from "@hono/swagger-ui";

import swagger from "../swagger.json";

const home = new Hono();
home.get("/", (c) => c.html("<h1>API de Filmes</h1>"));

const api = new Hono().basePath("/api");
api.use(cors());
api.use(logger());

api.get("/", (c) => {
  return c.text("Api Online!");
});

api.get("/doc", swaggerUI({ url: "/api/swagger" }));
api.get("/swagger", (c) => {
  return c.json(swagger);
});

api.notFound((c) => {
  return c.text("Rota inválida", 404);
});

api.onError((err, c) => {
  console.error(`${err}`);
  return c.text("Erro interno", 500);
});

api.route("/movies", moviesRoute);

const app = new Hono();
app.route("/", home);
app.route("/", api);

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
