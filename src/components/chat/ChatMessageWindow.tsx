import type { RouterOutputs } from '~/utils/api';
import * as React from 'react';
import { Box, Grid } from '@mui/material';
import { ChatMesssage } from '~/components/chat/ChatMessage';
import { ChatInput } from '~/components/chat/ChatInput';

const HEIGHT = '93vh';

export const ChatMessageWindow = ({
    chats,
    currentChat,
    handleSend,
    inputRef,
    messageEndRef,
}: {
    chats: RouterOutputs['chat']['listFull'];
    currentChat: number;
    handleSend: () => void;
    inputRef: React.MutableRefObject<
        { value: string; focus: () => void } | undefined
    >;
    messageEndRef: React.MutableRefObject<unknown>;
}) => (
    <Grid item xs={10}>
        <Box
            sx={{
                height: HEIGHT,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'grey.400',
            }}
        >
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {chats[currentChat]?.messages?.map((message) => (
                    <ChatMesssage key={message.id} message={message} />
                ))}
                {/*@ts-expect-error - ref is legacy todo: replace*/}
                <div ref={messageEndRef}></div>
            </Box>
            <ChatInput {...{ handleSend, inputRef }} />
        </Box>
    </Grid>
);
