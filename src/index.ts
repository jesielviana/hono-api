import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import swagger from "../swagger.json";
import moviesRoute from "./routes/movies";
import usersRoute from "./routes/users";
import loginRoute from "./routes/login";

const api = new Hono().basePath("/api");
api.use(cors());
api.use(logger());
api.use(secureHeaders());
api.use("/auth/*", jwt({ secret: Bun.env.JWT_SECRET as string }));

api.get("/auth/page", (c) => {
  console.log("You are authorized");
  const payload = c.get("jwtPayload");
  return c.json(payload);
});

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
api.route("/users", usersRoute);
api.route("/login", loginRoute);

const home = new Hono();
home.get("/", serveStatic({ path: "./index.html" }));
home.get("/favicon.ico", serveStatic({ path: "./favicon.ico" }));

const app = new Hono();
app.route("/", home);
app.route("/", api);

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
