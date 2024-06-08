import type { RouterOutputs } from '~/utils/api';
import ChatItem from '~/components/chat/ChatItem';
import * as React from 'react';
import { Busyness } from '~/components/chat/Busyness';
import { ScrollArea } from '../ui/scroll-area';
import { type UnreadMessages } from '~/utils/types';
import { Rabbit } from 'lucide-react';

export const ChatBar = ({
    chats,
    changeChat,
    closeChat,
    currentChat,
    unreadMessages,
}: {
    chats: RouterOutputs['chat']['listFull'];
    changeChat: (index: number) => void;
    closeChat: (chatID: number) => Promise<void>;
    currentChat: number;
    unreadMessages?: UnreadMessages;
}) => (
    <aside className="w-full space-y-4">
        <Busyness />
        <ScrollArea className="h-[calc(100vh-120px)] w-full">
            <div className="flex w-full flex-col gap-4 px-4 pb-4">
                {Object.values(chats).map((chat, index) => {
                    const unreadCounter = unreadMessages
                        ? unreadMessages.find((item) => item?.id === chat.id)
                              ?.counter
                        : 0;
                    return (
                        <ChatItem
                            key={index}
                            onClick={() => changeChat(chat.id)}
                            {...{
                                chats,
                                chat,
                                closeChat,
                                currentChat,
                                unreadCounter,
                            }}
                        />
                    );
                })}
                {Object.values(chats).length === 0 && (
                    <p className="flex h-[calc(100vh-140px)] w-full items-center justify-center gap-2 text-lg text-neutral-400">
                        Повідомлень ще немає <Rabbit />
                    </p>
                )}
            </div>
        </ScrollArea>
    </aside>
);
