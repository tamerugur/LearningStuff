import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/hash";
import { RegisterData } from "../schemas/userSchema";

const prisma = new PrismaClient();

export const AuthService = {
  async register(data: RegisterData) {
    const { email, username, fullName, tcId, password } = data;

    const existing = await prisma.authUser.findFirst({
      where: {
        OR: [{ email }, { username }, { tcId }],
      },
    });

    if (existing) {
      throw new Error("Email, username, or TC ID already exists");
    }

    const hashed = await hashPassword(password);

    const newUser = await prisma.authUser.create({
      data: {
        email,
        username,
        fullName,
        tcId,
        password: hashed,
      },
    });

    return { id: newUser.id, email: newUser.email, username: newUser.username };
  },
};
