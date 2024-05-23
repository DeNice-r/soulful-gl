import type { RouterOutputs } from '~/utils/api';
import ChatItem from '~/components/chat/ChatItem';
import * as React from 'react';
import { Busyness } from '~/components/chat/Busyness';
import { Spinner } from '~/components/ui/spinner';

export const ChatBar = ({
    chats,
    changeChat,
}: {
    chats: RouterOutputs['chat']['listFull'];
    changeChat: (index: number) => void;
}) => (
    <aside className="h-full">
        <div className="space-y-4">
            <Busyness />
            <div>
                {Object.values(chats).map((chat, index) => (
                    <ChatItem
                        key={index}
                        chat={chat}
                        onClick={() => changeChat(chat.id)}
                    />
                ))}
                {Object.values(chats).length === 0 && (
                    <Spinner size="large"></Spinner>
                )}
            </div>
        </div>
    </aside>
);
