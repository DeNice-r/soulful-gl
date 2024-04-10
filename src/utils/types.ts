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

export enum ManagementPageName {
    STATISTICS = 'statistics',
    USERS = 'users',
    OPERATORS = 'operators',
    POSTS = 'posts',
    EXCERCISES = 'excercises',
    KNOWLEDGE = 'knowledge',
    ACHIEVEMENTS = 'achievements',
    DONATIONS = 'donations',
    QnA = 'QnA',
}

export const PageTitleMap = {
    [ManagementPageName.STATISTICS]: 'Головна',
    [ManagementPageName.USERS]: 'Користувачі',
    [ManagementPageName.OPERATORS]: 'Оператори',
    [ManagementPageName.POSTS]: 'Дописи',
    [ManagementPageName.EXCERCISES]: 'Вправи',
    [ManagementPageName.KNOWLEDGE]: 'База знань',
    [ManagementPageName.ACHIEVEMENTS]: 'Досягнення',
    [ManagementPageName.DONATIONS]: 'Пожертви',
    [ManagementPageName.QnA]: 'Запитання та відповіді',
};
