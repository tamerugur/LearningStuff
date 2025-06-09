import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UserPayload {
  id: string;
  email: string;
  fullName: string;
}

export const UserService = {
  async findOrCreateUser(payload: UserPayload) {
    const { id, email, fullName } = payload;

    let user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      // User doesn't exist in this service's DB, create them.
      user = await prisma.user.create({
        data: {
          id,
          email,
          fullName,
        },
      });
    }

    return user;
  },
};
