import { Chat, Message } from '@prisma/client';

export const enum UserRole {
    USER,
    OPERATOR,
    ADMIN,
}

export interface ExtendedChat extends Chat {
    messages?: Message[];
}
