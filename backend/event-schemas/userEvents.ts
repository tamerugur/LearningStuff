export const USER_EVENTS = {
    CREATED: 'user.created',
    UPDATED: 'user.updated',
    DELETED: 'user.deleted',
  } as const;
  
  export type UserCreatedEvent = {
    id: string;
    email: string;
    fullName: string;
    username: string;
    nationalId: string | null; // TCKN
    createdAt: string; // ISO date string
  };

  export type UserEventType = typeof USER_EVENTS[keyof typeof USER_EVENTS];