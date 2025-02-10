import { Context } from "hono";

export function getLoggedUserId(c: Context) {
  return c.get("jwtPayload").id;
}
