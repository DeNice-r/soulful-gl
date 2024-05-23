import { Typography } from '@mui/material';
import { type ExtendedChat } from '~/utils/types';
import React from 'react';

interface ChatItemProps {
    chat: ExtendedChat;
    onClick: (e: React.SyntheticEvent) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ onClick, chat }) => {
    return (
        <div
            className="flex cursor-pointer flex-col gap-2 p-4 transition-colors hover:bg-neutral-200"
            onClick={onClick}
        >
            <h1 className="font-medium">Чат #{chat.id}</h1>
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: 'left' }}
            >
                {/*{chat.lastMessage}*/}
                {chat?.messages?.length > 0 && chat.messages.slice(-1)[0].text}
            </Typography>
        </div>
    );
};

export default ChatItem;
