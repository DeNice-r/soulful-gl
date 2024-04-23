import * as React from 'react';
import { Box, Grid, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export const ChatInput = ({
    handleSend,
    inputRef,
}: {
    handleSend: () => void;
    inputRef: React.RefObject<{ value: string; focus: () => void } | undefined>;
}) => (
    <Box sx={{ p: 0.5, backgroundColor: 'grey.300' }}>
        <Grid container spacing={1}>
            <Grid item xs={11.5}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message"
                    variant="outlined"
                    inputRef={inputRef}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            handleSend();
                        }
                    }}
                />
            </Grid>
            <Grid item xs={0.3}>
                <IconButton size="small" color="primary" onClick={handleSend}>
                    <SendIcon />
                </IconButton>
            </Grid>
        </Grid>
    </Box>
);
