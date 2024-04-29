import { Box, ButtonBase, Typography } from '@mui/material';
import { type ExtendedChat } from '~/utils/types';
import React from 'react';

interface ChatItemProps {
    chat: ExtendedChat;
    onClick: (e: React.SyntheticEvent) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ onClick, chat }) => {
    return (
        <ButtonBase
            onClick={onClick}
            sx={{ width: 1, justifyContent: 'flex-start' }}
        >
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ textAlign: 'left' }}
                >
                    Чат #{chat.id}
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ textAlign: 'left' }}
                >
                    {/*{chat.lastMessage}*/}
                    {chat?.messages?.length > 0 &&
                        chat.messages.slice(-1)[0].text}
                </Typography>
            </Box>
        </ButtonBase>
    );
};

export default ChatItem;
