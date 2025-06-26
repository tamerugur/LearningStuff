import amqp from 'amqplib';

type AmqpConnection = Awaited<ReturnType<typeof amqp.connect>>;
type AmqpChannel = Awaited<ReturnType<AmqpConnection['createChannel']>>;

let connection!: AmqpConnection;
let channel!: AmqpChannel;

export async function setupRabbitMQ(): Promise<void> {
  connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672'); // returns ChannelModel
  channel = await connection.createChannel(); // returns Channel
  await channel.assertExchange('user.events', 'topic', { durable: true });
}


export function publishToExchange(routingKey: string, message: object) {
  if (!channel) {
    throw new Error('RabbitMQ channel is not initialized');
  }

  const payload = Buffer.from(JSON.stringify(message));
  channel.publish('user.events', routingKey, payload, {
    persistent: true,
    contentType: 'application/json',
  });
}
