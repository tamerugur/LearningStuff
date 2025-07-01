import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";

import { setupMessaging } from "./setup/setupMessaging";

dotenv.config();
console.log("DATABASE_URL from .env:", process.env.DATABASE_URL);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4001;


app.listen(PORT, async () => {
  console.log(`✅ Auth service running on http://localhost:${PORT}`);

  try {
    await setupMessaging();
    console.log("📡 RabbitMQ setup complete for auth-service");
  } catch (err) {
    console.error("❌ RabbitMQ setup failed:", err);
    process.exit(1); // fail fast
  }
});
