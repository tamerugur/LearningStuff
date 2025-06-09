import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/hash";
import { RegisterData, LoginData } from "../schemas/userSchema";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

export const AuthService = {
  async register(data: RegisterData) {
    const { email, username, fullName, tcId, password } = data;

    const orConditions: (
      | { email: string }
      | { username: string }
      | { tcId: string }
    )[] = [{ email }, { username }];

    if (tcId) {
      orConditions.push({ tcId });
    }

    const existing = await prisma.authUser.findFirst({
      where: {
        OR: orConditions,
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

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const hashedRefreshToken = await hashPassword(refreshToken);

    await prisma.authUser.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    return { accessToken, refreshToken };
  },

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as {
        id: string;
        email: string;
      };

      const user = await prisma.authUser.findUnique({
        where: { id: decoded.id },
      });

      if (!user || !user.refreshToken) {
        throw new Error("Invalid refresh token");
      }

      const isRefreshTokenValid = await comparePassword(
        token,
        user.refreshToken
      );

      if (!isRefreshTokenValid) {
        throw new Error("Invalid refresh token");
      }

      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        {
          expiresIn: "15m",
        }
      );

      return { accessToken };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  },

  async logout(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as {
        id: string;
      };
      await prisma.authUser.update({
        where: { id: decoded.id },
        data: { refreshToken: null },
      });
    } catch (error) {
      // If the token is invalid or expired, we don't need to do anything
      return;
    }
  },
};
