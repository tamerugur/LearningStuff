import { UserCreatedEvent, USER_EVENTS } from '../../../event-schemas/userEvents';
import { publishToExchange } from './rabbitmq';

export function publishUserCreatedEvent(payload: UserCreatedEvent) {
  publishToExchange(USER_EVENTS.CREATED, payload);
}
