import type { Message } from '@prisma/client';
import * as React from 'react';
import { cn } from '~/lib/utils';

export const ChatMesssage = ({ message }: { message: Message }) => {
    const isRemote = message.isFromUser;

    return (
        <div className={cn('flex', !isRemote ? 'justify-end pl-10' : 'pr-10')}>
            <div
                className={cn(
                    'rounded-lg bg-neutral-200 p-2 text-sm dark:bg-zinc-700',
                    !isRemote && 'bg-blue-500 text-white',
                )}
            >
                <p>{message.text}</p>
            </div>
        </div>
    );
};
