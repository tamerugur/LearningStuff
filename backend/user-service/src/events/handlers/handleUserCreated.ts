import { UserCreatedEvent } from '@microservices/event-schemas';
import { prisma } from '../../../lib/prisma';

export async function handleUserCreated(event: UserCreatedEvent) {
  await prisma.user.create({
    data: {
      id: event.id,
      email: event.email,
      fullName: event.fullName,
      username: event.username,
      tcId: event.nationalId,
      createdAt: new Date(event.createdAt),
    },
  });

  console.log(`✅ User created in userService DB: ${event.email}`);
}
