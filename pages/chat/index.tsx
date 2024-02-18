import * as React from 'react';
import { useEffect } from 'react';
import { Message } from '@prisma/client';
import {
    Alert,
    Box,
    Fade,
    Grid,
    IconButton,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Layout from '../../components/Layout';
import ChatItem from '../../components/ChatItem';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import { ExtendedChat } from '#types';

const HEIGHT = '96vh';

const ChatUI = () => {
    const { data: session, status } = useSession();

    const [error, setError] = React.useState(false);
    const [currentChat, setCurrentChat] = React.useState(0);
    const [messageCount, setMessageCount] = React.useState(0);
    const [chatCount, setChatCount] = React.useState(0);

    const inputRef = React.useRef(null);
    const messageEndRef = React.useRef(null);
    const wsRef = React.useRef(null);

    const messagesRef = React.useRef({});

    async function loadNewChats(chatId: number) {
        const newChat: ExtendedChat = await prisma.chat.findFirst({
            where: {
                id: chatId,
            },
        });

        newChat.messages = await prisma.message.findMany({
            where: {
                chatId: chatId,
            },
        });

        session.personnel.chats[newChat.id] = newChat;
        setChatCount(Object.values(session.personnel.chats).length);
    }

    function pushMessage(message: Message) {
        const messageChatIndex = -1;

        if (!(message.chatId in session.personnel.chats)) {
            // loadNewChats(message.chatId);
        }

        session.personnel.chats[message.chatId].messages.push(message);
        setMessageCount(
            session.personnel.chats[message.chatId].messages.length,
        );

        setTimeout(() => {
            messageEndRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 0);
    }

    useEffect(() => {
        scrollToBottom(false);
    }, []);

    useEffect(() => {
        if (status !== 'authenticated') return;

        const chats = Object.values(session.personnel.chats);

        if (!chats.length || chats.length === 0) return;

        setCurrentChat(chats[0].id!);

        wsRef.current = new WebSocket(
            `${process.env.NEXT_PUBLIC_WSS_ENDPOINT}/${session?.user?.id}`,
        );
        wsRef.current.onopen = () =>
            console.log('[Router] Connection established');
        wsRef.current.onclose = () => console.log('[Router] Connection closed');
        wsRef.current.onerror = () => console.log('[Router] Connection error');

        wsRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            pushMessage(message);
        };

        return () => {
            wsRef.current.close();
        };
    }, [status]);

    const scrollToBottom = (smooth: boolean = true) => {
        setTimeout(() => {
            messageEndRef.current.scrollIntoView({
                behavior: smooth ? 'smooth' : 'instant',
                block: 'center',
            });
        }, 0);
    };

    const handleSend = () => {
        const message = inputRef.current.value;
        if (message.trim() !== '') {
            if (wsRef.current.readyState !== WebSocket.OPEN) {
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 5000);
                return;
            }

            const chat = session.personnel.chats[currentChat];
            wsRef.current.send(
                JSON.stringify({
                    text: message,
                    userId: chat.userId,
                    chatId: chat.id,
                    isFromUser: false,
                }),
            );
        }
        inputRef.current.value = '';
        inputRef.current.focus();
        scrollToBottom();
    };

    const changeChat = async (index: number) => {
        setCurrentChat(index);
        scrollToBottom(false);
    };

    return (
        <Layout>
            <Fade in={error}>
                <Alert
                    variant="filled"
                    severity="error"
                    sx={{ position: 'absolute', 'z-index': 1 }}
                >
                    You are not connected to the internet
                </Alert>
            </Fade>
            <Grid container spacing={0}>
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
                            {session &&
                                Object.values(session.personnel.chats).map(
                                    (chat, index) => (
                                        <ChatItem
                                            key={index}
                                            chat={chat}
                                            onClick={() => changeChat(chat.id)}
                                        />
                                    ),
                                )}
                        </Box>
                    </Box>
                </Grid>
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
                            {session &&
                                session.personnel.chats[
                                    currentChat
                                ]?.messages?.map((message) => (
                                    <Message
                                        key={message.id}
                                        message={message}
                                    />
                                ))}
                            <div ref={messageEndRef}></div>
                        </Box>
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
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={handleSend}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Layout>
    );
};

const Message = ({ message }) => {
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

export default ChatUI;
