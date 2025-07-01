import { PrismaClient } from '@prisma/client';
import { UserCreatedEvent } from '@tamerugur/event-schemas';

const prisma = new PrismaClient();

export async function handleUserCreated(event: UserCreatedEvent): Promise<void> {
  await prisma.user.create({
    data: {
      id: event.id,
      email: event.email,
      fullName: event.fullName,
      username: event.username,
      tcId: event.nationalId ?? null,
      createdAt: new Date(event.createdAt),
    },
  });

  console.log(`✅ User created in user-service: ${event.id}`);
}
