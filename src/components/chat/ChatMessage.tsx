import type { Message } from '@prisma/client';
import { Box, Paper, Typography } from '@mui/material';
import * as React from 'react';

export const ChatMesssage = ({ message }: { message: Message }) => {
    const isRemote = message.isFromUser;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isRemote ? 'flex-start' : 'flex-end',
                mb: 2,
            }}
        >
            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    backgroundColor: isRemote
                        ? 'primary.light'
                        : 'secondary.light',
                    color: isRemote
                        ? 'primary.contrastText'
                        : 'secondary.contrastText',
                    borderRadius: isRemote
                        ? '20px 20px 20px 5px'
                        : '20px 20px 5px 20px',
                }}
            >
                <Typography variant="body1">{message.text}</Typography>
            </Paper>
        </Box>
    );
};
