import type { RouterOutputs } from '~/utils/api';
import { Box, Grid } from '@mui/material';
import ChatItem from '~/components/chat/ChatItem';
import * as React from 'react';
import { Busyness } from '~/components/chat/Busyness';

export const ChatBar = ({
    chats,
    changeChat,
}: {
    chats: RouterOutputs['chat']['listFull'];
    changeChat: (index: number) => void;
}) => (
    <Grid item xs={2}>
        <Box
            className="m-0 overflow-auto"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'grey.300',
                height: 'calc(100vh - 4rem)',
            }}
        >
            <Busyness />
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {Object.values(chats).map((chat, index) => (
                    <ChatItem
                        key={index}
                        chat={chat}
                        onClick={() => changeChat(chat.id)}
                    />
                ))}
            </Box>
        </Box>
    </Grid>
);
