export const USER_EVENTS = {
    CREATED: 'user.created',
    UPDATED: 'user.updated',
    DELETED: 'user.deleted',
  } as const;
  
  export type UserCreatedEvent = {
    id: string;
    email: string;
    createdAt: string; // ISO date string
    fullName: string;
    nationalId: string; // TCKN
  };

  export type UserEventType = typeof USER_EVENTS[keyof typeof USER_EVENTS];