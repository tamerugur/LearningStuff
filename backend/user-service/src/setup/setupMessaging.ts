import { getChannel } from '../rabbitmq';
import { USER_EVENTS } from '@tamerugur/event-schemas';

export async function setupMessaging(): Promise<void> {
  const channel = await getChannel();

  await channel.assertExchange('user.events', 'topic', {
    durable: true,
  });

  await channel.assertExchange('user.events.dlx', 'fanout', {
    durable: true,
  });

  // assertExchange == declare (or make sure it exists) the exchange

  await channel.assertQueue('user-service.user.created', {
    durable: true,
    deadLetterExchange: 'user.events.dlx',
  });

  await channel.assertQueue('user-service.user.created.dlq', {
    durable: true,
  });

  //assertQueue == declare (or make sure it exists) the queue

  await channel.bindQueue('user-service.user.created', 'user.events', USER_EVENTS.CREATED);
  await channel.bindQueue('user-service.user.created.dlq', 'user.events.dlx', '');
}
