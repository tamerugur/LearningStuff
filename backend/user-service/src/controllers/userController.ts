import { Response } from "express";
import { UserService } from "../services/userService";
import { AuthRequest } from "../middleware/authMiddleware";

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const userPayload = req.user;
    if (!userPayload) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await UserService.findOrCreateUser(userPayload);

    res
      .status(200)
      .json({ message: `Welcome to the main page, ${user.fullName}!` });
  } catch (err: any) {
    res.status(500).json({ error: "An unexpected error occurred" });
  }
}
