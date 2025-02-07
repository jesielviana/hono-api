import { Prisma, PrismaClient, User } from "@prisma/client";

type UserWithoutPass = Omit<User, "password">;

class UserRepostitory implements Repostiory<User, UserWithoutPass> {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  save(entity: Prisma.UserCreateInput): Promise<User> {
    throw new Error("Method not implemented.");
  }

  update(entity: Prisma.UserUpdateInput): Promise<User> {
    throw new Error("Method not implemented.");
  }

  delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }

  findById(id: number): Promise<UserWithoutPass> {
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<UserWithoutPass[]> {
    const users = this.prisma.user.findMany({
      omit: { password: true },
    });
    return users;
  }
}

export default UserRepostitory;
