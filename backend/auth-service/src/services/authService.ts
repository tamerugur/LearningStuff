import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/hash";
import { RegisterData, LoginData } from "../schemas/userSchema";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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

  async login(data: LoginData) {
    const { identifier, password } = data;

    const user = await prisma.authUser.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return { token };
  },
};
