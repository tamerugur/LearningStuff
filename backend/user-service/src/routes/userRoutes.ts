import { Router, RequestHandler } from "express";
import { getProfile } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/profile",
  authMiddleware as RequestHandler,
  getProfile as RequestHandler
);

export default router;
