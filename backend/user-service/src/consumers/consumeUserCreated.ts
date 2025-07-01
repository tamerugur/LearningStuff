import { getChannel } from '../rabbitmq';
import { USER_EVENTS, UserCreatedEvent } from '@tamerugur/event-schemas';
import { handleUserCreated } from '../handlers/handleUserCreated';

export async function consumeUserCreated(): Promise<void> {
  const channel = await getChannel();

  await channel.consume('user-service.user.created', async (msg) => {
    if (!msg) return;

    try {
      const raw = msg.content.toString();
      const data: UserCreatedEvent = JSON.parse(raw);

      await handleUserCreated(data);

      channel.ack(msg);
    } catch (err) {
      console.error('❌ Failed to process user.created event:', err);
      channel.nack(msg, false, false); // send to DLQ
    }
  }, {
    noAck: false, // we want to ack manually
  });
}
