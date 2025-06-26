import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import { setupRabbitMQ } from './events/rabbitmq';

dotenv.config();
console.log("DATABASE_URL from .env:", process.env.DATABASE_URL);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4001;

async function bootstrap() {
  try {
    await setupRabbitMQ();
    console.log("📡 RabbitMQ initialized");

    app.listen(PORT, () => {
      console.log(`✅ Auth service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to initialize RabbitMQ:", error);
    process.exit(1);
  }
}

bootstrap();
