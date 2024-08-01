import { Hono, Context } from "hono";
import prisma from "../config/prisma";
import { sign } from "hono/jwt";

const loginRoute = new Hono();

loginRoute.post("/", async (c: Context) => {
  const body = await c.req.json();
  const { email, password } = body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return c.json({ message: "Usuário não encontrado" }, 400);
  }
  const verify = Bun.password.verifySync(password, user.password);
  if (!verify) {
    return c.json({ message: "Senha inválida" }, 400);
  }
  const secret = Bun.env.JWT_SECRET as string;
  const token = await sign(
    {
      id: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    },
    secret,
    "HS256",
  );

  return c.json(
    {
      message: "Login Success",
      data: {
        token: token,
      },
    },
    200,
  );
});

export default loginRoute;
