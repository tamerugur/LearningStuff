import amqp, { Message } from "amqplib";
import { USER_EVENTS } from "../../../event-schemas/userEvents";
import { handleUserCreated } from "./handlers/handleUserCreated";

type AmqpConnection = Awaited<ReturnType<typeof amqp.connect>>;
type AmqpChannel = Awaited<ReturnType<AmqpConnection["createChannel"]>>;

let connection!: AmqpConnection;
let channel!: AmqpChannel;

export async function setupRabbitMQ(): Promise<void> {
  try {
    console.log("🔌 Connecting to RabbitMQ...");
    connection = await amqp.connect("amqp://guest:guest@rabbitmq:5672");
    channel = await connection.createChannel();

    console.log("📡 Setting up RabbitMQ exchange and queue...");
    await channel.assertExchange("user.events", "topic", { durable: true });

    // Create queue for user service
    const queueResult = await channel.assertQueue("user-service-queue", {
      durable: true,
    });

    // Bind queue to exchange with routing key
    await channel.bindQueue(
      queueResult.queue,
      "user.events",
      USER_EVENTS.CREATED
    );

    console.log("✅ RabbitMQ setup completed successfully");
  } catch (error) {
    console.error("❌ Failed to setup RabbitMQ:", error);
    throw error;
  }
}

export async function consumeUserEvents(): Promise<void> {
  try {
    if (!channel) {
      throw new Error("RabbitMQ channel is not initialized");
    }

    console.log("🎧 Starting to consume user events...");

    await channel.consume("user-service-queue", async (msg: Message | null) => {
      if (!msg) {
        console.warn("⚠️ Received null message from queue");
        return;
      }

      try {
        const content = msg.content.toString();
        const event = JSON.parse(content);
        const routingKey = msg.fields.routingKey;

        console.log(`📨 Received event: ${routingKey}`, { eventId: event.id });

        switch (routingKey) {
          case USER_EVENTS.CREATED:
            await handleUserCreated(event);
            break;
          default:
            console.warn(`⚠️ Unknown routing key: ${routingKey}`);
        }

        // Acknowledge the message
        channel.ack(msg);
        console.log(`✅ Processed event: ${routingKey}`);
      } catch (error) {
        console.error("❌ Error processing message:", error);
        // Reject the message and requeue it
        channel.nack(msg, false, true);
      }
    });

    console.log("✅ User events consumer started successfully");
  } catch (error) {
    console.error("❌ Failed to start user events consumer:", error);
    throw error;
  }
}

export async function closeRabbitMQConnection(): Promise<void> {
  try {
    if (channel) {
      await channel.close();
      console.log("🔌 RabbitMQ channel closed");
    }
    if (connection) {
      await connection.close();
      console.log("🔌 RabbitMQ connection closed");
    }
  } catch (error) {
    console.error("❌ Error closing RabbitMQ connection:", error);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Received SIGINT, closing RabbitMQ connection...");
  await closeRabbitMQConnection();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🛑 Received SIGTERM, closing RabbitMQ connection...");
  await closeRabbitMQConnection();
  process.exit(0);
});
