import { type Chat, type Message } from '@prisma/client';

export const enum UserRole {
    USER,
    OPERATOR,
    ADMIN,
}

export const enum BackgroundPattern {
    A,
    B,
    C,
    D,
    E,
    F,
}

export interface ExtendedChat extends Chat {
    messages: Message[];
}
