import { Request, Response } from "express";
import { registerSchema } from "../schemas/userSchema";
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
