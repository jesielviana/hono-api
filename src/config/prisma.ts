import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  // log: ["info", "error", "query", "warn"],
  log: ["info", "error", "warn"],
  errorFormat: "pretty",
});

export default prisma;
