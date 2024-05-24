import { Typography } from '@mui/material';
import { type ExtendedChat } from '~/utils/types';
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '~/lib/utils';

interface ChatItemProps {
    chat: ExtendedChat;
    onClick: (e: React.SyntheticEvent) => void;
    closeChat: (chatID: number) => Promise<void>;
    currentChat: number;
}

const ChatItem: React.FC<ChatItemProps> = ({
    onClick,
    chat,
    closeChat,
    currentChat,
}) => {
    return (
        <div
            className={cn(
                'group flex h-24 rounded-2xl border',
                currentChat === chat.id && 'bg-neutral-200',
            )}
        >
            <div
                className="flex flex-grow cursor-pointer flex-col gap-2 p-4"
                onClick={onClick}
            >
                <h1 className="font-medium">Чат #{chat.id}</h1>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ textAlign: 'left' }}
                >
                    {/*{chat.lastMessage}*/}
                    {chat?.messages?.length > 0 &&
                        chat.messages.slice(-1)[0].text}
                </Typography>
            </div>
            <div
                onClick={() => closeChat(chat.id)}
                className={cn(
                    'invisible flex h-full w-12 cursor-pointer items-center justify-center transition-colors hover:text-red-600 group-hover:visible',
                    currentChat === chat.id && 'visible',
                )}
            >
                <X />
            </div>
        </div>
    );
};

export default ChatItem;
