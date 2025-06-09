import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../schemas/userSchema";
import { AuthService } from "../services/authService";

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  try {
    const result = await AuthService.register(parsed.data);
    res.status(201).json({ message: "User registered", user: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }

  try {
    const { accessToken, refreshToken } = await AuthService.login(parsed.data);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    console.log("Generated Access Token:", accessToken);

    res.status(200).json({ accessToken });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}

export async function refreshToken(req: Request, res: Response) {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token not found" });
  }

  try {
    const result = await AuthService.refreshToken(refreshToken);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    await AuthService.logout(refreshToken);
  }

  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
}

export async function getProfile(req: Request, res: Response) {
  res.status(200).json({ message: "This is a protected route" });
}
