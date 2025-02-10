import { Movie, Prisma, PrismaClient, User } from "@prisma/client";

type UserWithMovies = User & { movies: Movie[] };

class UserRepostitory implements Repostiory<User> {
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

  async findById(id: number): Promise<UserWithMovies | null> {
    const user = (await this.prisma.user.findUnique({
      where: { id },
      include: { movies: true },
      omit: { password: true },
    })) as UserWithMovies;
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = (await this.prisma.user.findMany({
      omit: { password: true },
    })) as User[];
    return users;
  }
}

export default UserRepostitory;
