import amqp, { Channel, ChannelModel } from 'amqplib';

type AmqpConnection = ChannelModel;
type AmqpChannel = Channel;

let connection: AmqpConnection | null = null;
let channel: AmqpChannel | null = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@rabbitmq:5672';

async function connect(): Promise<void> {
  if (connection) return;
  console.log('[RabbitMQ] attempting', RABBITMQ_URL);
  connection = (await amqp.connect(RABBITMQ_URL)) as ChannelModel;
  // amqtp connect used to return a connection object, but now it returns channelmodel so I cast it specifically to avoid mismatch
  connection.on('error', err => console.error('[RabbitMQ] connection error:', err));
  connection.on('close', () => {
    console.warn('[RabbitMQ] connection closed');
    connection = null;
    channel = null;
  });
}

export async function getChannel(): Promise<AmqpChannel> {
  if (channel) return channel;
  await connect();
  if (!connection) throw new Error('RabbitMQ connection not established');
  channel = await connection.createChannel();
  channel.on('error', err => console.error('[RabbitMQ] channel error:', err));
  channel.on('close', () => {
    console.warn('[RabbitMQ] channel closed');
    channel = null;
  });
  return channel;
}

export async function closeRabbitMQ(): Promise<void> {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
  } catch (err) {
    console.error('[RabbitMQ] error during close:', err);
  } finally {
    connection = null;
    channel = null;
  }
}
