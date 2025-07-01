import { getChannel } from '../rabbitmq';

export async function setupMessaging(): Promise<void> {
  const channel = await getChannel();

  await channel.assertExchange('user.events', 'topic', {
    durable: true,
  });

  await channel.assertExchange('user.events.dlx', 'fanout', {
    durable: true,
  });
}
