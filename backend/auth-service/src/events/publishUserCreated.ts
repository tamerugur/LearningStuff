import { getChannel } from './rabbitmq';
import { USER_EVENTS, UserCreatedEvent } from '@tamerugur/event-schemas';

export async function publishUserCreated(payload: UserCreatedEvent): Promise<void> {
  const channel = await getChannel();

  const buffer = Buffer.from(JSON.stringify(payload));

  channel.publish('user.events', USER_EVENTS.CREATED, buffer, {
    persistent: true,
    contentType: 'application/json',
  });
}
