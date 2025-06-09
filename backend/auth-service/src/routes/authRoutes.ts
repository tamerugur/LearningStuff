import { Router, RequestHandler } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register as RequestHandler);
router.post("/login", login as RequestHandler);
router.post("/refresh-token", refreshToken as RequestHandler);
router.post("/logout", logout as RequestHandler);

router.get(
  "/profile",
  authMiddleware as RequestHandler,
  getProfile as RequestHandler
);

export default router;
