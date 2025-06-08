import { Router, RequestHandler } from "express";
import { register } from "../controllers/authController";

const router = Router();

router.post("/register", register as RequestHandler);

export default router;
