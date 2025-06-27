import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/hash";
import { RegisterData, LoginData } from "../schemas/userSchema";
import jwt from "jsonwebtoken";
import { publishUserCreatedEvent } from "../events/publishUserCreated";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

export const AuthService = {
  async register(data: RegisterData) {
    const { email, username, fullName, tcId, password } = data;
    console.log("📨 Incoming registration:", { email, username, tcId });

    try {
      const conditions: (
        | { email: string }
        | { username: string }
        | { tcId: string }
      )[] = [{ email }, { username }];
      if (tcId) conditions.push({ tcId });

      const existing = await prisma.authUser.findFirst({
        where: { OR: conditions },
      });

      if (existing) {
        console.warn("🚫 Conflict: Email, username, or TC ID already exists.");
        throw new Error("Email, username, or TC ID already exists");
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await prisma.authUser.create({
        data: {
          email,
          username,
          fullName,
          tcId,
          password: hashedPassword,
        },
      });

      console.log("✅ User registered successfully:", newUser.id);

      // Publish user created event
      try {
        publishUserCreatedEvent({
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          username: newUser.username,
          nationalId: newUser.tcId || "",
          createdAt: newUser.createdAt.toISOString(),
        });
        console.log("📤 User created event published successfully");
      } catch (eventError) {
        console.error("❌ Failed to publish user created event:", eventError);
        // Don't fail the registration if event publishing fails
      }

      return {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      };
    } catch (error) {
      console.error("❌ Registration error:", error);
      throw new Error("Registration failed");
    }
  },

  async login(data: LoginData) {
    const { identifier, password } = data;
    console.log("🔐 Login attempt with:", identifier);

    try {
      const user = await prisma.authUser.findFirst({
        where: {
          OR: [{ email: identifier }, { username: identifier }],
        },
      });

      if (!user) {
        console.warn("🚫 Login failed: User not found");
        throw new Error("Invalid credentials");
      }

      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        console.warn("🚫 Login failed: Incorrect password");
        throw new Error("Invalid credentials");
      }

      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { id: user.id, email: user.email },
        JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      const hashedRefreshToken = await hashPassword(refreshToken);

      await prisma.authUser.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefreshToken },
      });

      console.log("✅ Login successful:", user.id);

      return { accessToken, refreshToken };
    } catch (error) {
      console.error("❌ Login error:", error);
      throw new Error("Login failed");
    }
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
        { expiresIn: "15m" }
      );

      return { accessToken };
    } catch (error) {
      console.error("❌ Refresh token error:", error);
      throw new Error("Invalid refresh token");
    }
  },

  async logout(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { id: string };

      await prisma.authUser.update({
        where: { id: decoded.id },
        data: { refreshToken: null },
      });

      console.log(`🚪 User ${decoded.id} logged out.`);
    } catch (error) {
      if (error instanceof Error) {
        console.warn("⚠️ Logout failed (invalid token):", error.message);
      }
    }
  },
};
