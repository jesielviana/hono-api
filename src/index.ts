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
import { HTTPResponseError } from "hono/types";

const app = new Hono();
app.use(cors());
app.use(logger());
app.use(secureHeaders());

app.get("/auth/page", (c) => {
  console.log("You are authorized");
  const payload = c.get("jwtPayload");
  return c.json(payload);
});

app.get("/", swaggerUI({ url: "/doc" }));
app.get("/doc", (c) => {
  return c.json(swagger);
});

app.notFound((c) => {
  return c.text("Rota inválida", 404);
});

app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ message: err.message }, err.status || 500);
});

app.route("/api/users", usersRoute);
app.route("/api/login", loginRoute);
app.use("/api/*", jwt({ secret: Bun.env.JWT_SECRET as string }));
app.route("/api/movies", moviesRoute);

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
