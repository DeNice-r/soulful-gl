import { type Chat, type Message } from '@prisma/client';

export enum UserRole {
    USER,
    OPERATOR,
    ADMIN,
}

export enum BackgroundPattern {
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
