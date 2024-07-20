import { Hono } from "hono";
import { logger } from "hono/logger";
import { moviesRoute } from "./routes/movies";
import { cors } from "hono/cors";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";

const app = new OpenAPIHono();

app.get(
  "/ui",
  swaggerUI({
    url: "/doc",
  }),
);

app.doc("/doc", {
  info: {
    title: "An API",
    version: "v1",
  },
  openapi: "3.1.0",
});

app.use(cors());
app.use(logger());

app.get("/", (c) => {
  return c.text("Api Online!");
});

app.notFound((c) => {
  return c.text("Rota inválida", 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.text("Erro interno", 500);
});

app.route("/movies", moviesRoute);

export default app;
