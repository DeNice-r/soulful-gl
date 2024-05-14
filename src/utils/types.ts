import { type Chat, type Message } from '@prisma/client';
import { type ReactNode } from 'react';

export enum BackgroundPattern {
    A,
    B,
    C,
    D,
    E,
    F,
}

export interface Meta {
    hasPermissionProtection?: boolean;
    hasSpaProtection?: boolean;
}

export enum AccessType {
    NONE,
    OWN,
    ALL,
}

export const BusynessEmoji = {
    '😴': 0,
    '😊': 1,
    '😤': 2,
    '🤯': 3,
    '🤬': 4,
};

export interface ExtendedChat extends Chat {
    messages: Message[];
}

export type Props = {
    children?: ReactNode;
    className?: string;
};

export enum ManagementPageName {
    STATISTICS = 'statistics',
    USERS = 'users',
    OPERATORS = 'operators',
    POSTS = 'posts',
    RECOMMENDATIONS = 'recommendations',
    EXERCISES = 'exercises',
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
    [ManagementPageName.RECOMMENDATIONS]: 'Рекомендації',
    [ManagementPageName.EXERCISES]: 'Вправи',
    [ManagementPageName.KNOWLEDGE]: 'База знань',
    [ManagementPageName.ACHIEVEMENTS]: 'Досягнення',
    [ManagementPageName.DONATIONS]: 'Пожертви',
    [ManagementPageName.QnA]: 'Запитання та відповіді',
};

export const SearchableUserFields = {
    ID: 'id',
    EMAIL: 'email',
    NAME: 'name',
    DESCRIPTION: 'description',
    NOTES: 'notes',
} as const;

export const SortableUserFields = {
    ID: 'id',
    EMAIL: 'email',
    NAME: 'name',
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
    REPORT_COUNT: 'reportCount',
    SUSPENDED: 'suspended',
} as const;

export const SearchablePostFields = {
    ID: 'id',
    TITLE: 'title',
    DESCRIPTION: 'description',
} as const;

export const SortablePostFields = {
    ID: 'id',
    TITLE: 'title',
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
    PUBLISHED: 'published',
};

export const SearchableRecommendationFields = {
    ID: 'id',
    TITLE: 'title',
    DESCRIPTION: 'description',
} as const;

export const SortableRecommendationFields = {
    ID: 'id',
    TITLE: 'title',
    DESCRIPTION: 'description',
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
    PUBLISHED: 'published',
};

export const SearchableExerciseFields = {
    ID: 'id',
    TITLE: 'title',
    DESCRIPTION: 'description',
} as const;

export const SortableExerciseFields = {
    ID: 'id',
    TITLE: 'title',
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
    PUBLISHED: 'published',
};

export const Order = {
    ASC: 'asc',
    DESC: 'desc',
};
