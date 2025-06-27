import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import { setupRabbitMQ, consumeUserEvents } from "./events/rabbitmq";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

const PORT = process.env.USER_SERVICE_PORT || 4002;

async function bootstrap() {
  try {
    // Setup RabbitMQ connection and queues
    await setupRabbitMQ();
    console.log("📡 RabbitMQ initialized");

    // Start consuming user events
    await consumeUserEvents();
    console.log("🎧 User events consumer started");

    app.listen(PORT, () => {
      console.log(`✅ User service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to initialize user service:", error);
    process.exit(1);
  }
}

bootstrap();
