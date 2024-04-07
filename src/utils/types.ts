import { type Chat, type Message } from '@prisma/client';
import { type ReactNode } from 'react';

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

export enum AccessType {
    NONE,
    OWN,
    ALL,
}

export interface ExtendedChat extends Chat {
    messages: Message[];
}

export type RoleAssertionFunction = (
    userRole: UserRole | undefined,
    thresholdRole: UserRole,
) => boolean;

export type Props = {
    children?: ReactNode;
};

export enum ManagementPageNames {
    USERS = 'users',
    OPERATORS = 'operators',
    STATISTICS = 'statistics',
}
