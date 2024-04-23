import type { RouterOutputs } from '~/utils/api';
import { Box, Grid } from '@mui/material';
import ChatItem from '~/components/chat/ChatItem';
import * as React from 'react';

const HEIGHT = '93vh';

export const ChatBar = ({
    chats,
    changeChat,
}: {
    chats: RouterOutputs['chat']['listFull'];
    changeChat: (index: number) => void;
}) => (
    <Grid item xs={2}>
        <Box
            sx={{
                height: HEIGHT,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'grey.300',
            }}
        >
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {chats &&
                    Object.values(chats).map((chat, index) => (
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
