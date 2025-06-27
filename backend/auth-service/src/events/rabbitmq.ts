import amqp from "amqplib";

type AmqpConnection = Awaited<ReturnType<typeof amqp.connect>>;
type AmqpChannel = Awaited<ReturnType<AmqpConnection["createChannel"]>>;

let connection!: AmqpConnection;
let channel!: AmqpChannel;

export async function setupRabbitMQ(): Promise<void> {
  try {
    console.log("🔌 Connecting to RabbitMQ...");
    connection = await amqp.connect("amqp://guest:guest@rabbitmq:5672"); // returns ChannelModel
    channel = await connection.createChannel(); // returns Channel

    console.log("📡 Setting up RabbitMQ exchange...");
    await channel.assertExchange("user.events", "topic", { durable: true });

    console.log("✅ RabbitMQ setup completed successfully");
  } catch (error) {
    console.error("❌ Failed to setup RabbitMQ:", error);
    throw error;
  }
}

export function publishToExchange(routingKey: string, message: object) {
  if (!channel) {
    console.error("❌ RabbitMQ channel is not initialized");
    throw new Error("RabbitMQ channel is not initialized");
  }

  try {
    const payload = Buffer.from(JSON.stringify(message));
    const success = channel.publish("user.events", routingKey, payload, {
      persistent: true,
      contentType: "application/json",
    });

    if (!success) {
      console.error("❌ Failed to publish message to exchange");
      throw new Error("Failed to publish message to exchange");
    }

    console.log(`📤 Published event: ${routingKey}`);
  } catch (error) {
    console.error("❌ Error publishing to exchange:", error);
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
