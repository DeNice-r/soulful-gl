import * as React from 'react';
import { useEffect } from 'react';
import { type Message } from '@prisma/client';
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
import { api, type RouterOutputs } from '~/utils/api';
const HEIGHT = '93vh';

const ChatUI = () => {
    const { data: session, status } = useSession();

    const { client: apiClient } = api.useContext();
    const chatListFullQuery = api.chat.listFull.useQuery();

    const [chats, setChats] = React.useState<RouterOutputs['chat']['listFull']>(
        {},
    );

    const [error, setError] = React.useState(false);
    const [currentChat, setCurrentChat] = React.useState<number>(-1);
    const [messageCount, setMessageCount] = React.useState(0);

    const inputRef = React.useRef<{ value: string; focus: () => void }>();
    const messageEndRef = React.useRef();

    const wsRef = React.useRef<WebSocket>();
    const wsReconnectInterval = React.useRef<NodeJS.Timeout>();

    // async function loadNewChats(chatId: number) {
    //     if (!session) return;
    //
    //     const newChat: ExtendedChat = await db.chat.findFirst({
    //         where: {
    //             id: chatId,
    //         },
    //     });
    //
    //     newChat.messages = await db.message.findMany({
    //         where: {
    //             chatId: chatId,
    //         },
    //     });
    //
    //     session.personnel.chats[newChat.id] = newChat;
    //     setChatCount(Object.values(session.personnel.chats).length);
    // }

    async function pushMessage(message: Message) {
        if (!session) return;

        if (!(message.chatId in chats)) {
            const newChat = await apiClient.chat.getFull.query(message.chatId);
            if (!newChat) return;

            chats[message.chatId] = newChat;
        } else {
            chats[message.chatId].messages.push(message);
        }

        setChats({ ...chats });

        setTimeout(() => {
            // @ts-expect-error - ref is legacy todo: replace
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            messageEndRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 0);
    }

    useEffect(() => {
        scrollToBottom(false);
        setChats(chatListFullQuery.data ?? {});
    }, [chatListFullQuery.data]);

    function wsConnect() {
        if (!session) return;
        wsRef.current = new WebSocket(
            `${process.env.NEXT_PUBLIC_WSS_ENDPOINT}/${session?.user?.id}`,
        );

        wsRef.current.onopen = wsOnOpen;
        wsRef.current.onclose = wsOnClose;
        wsRef.current.onerror = wsOnError;
        wsRef.current.onmessage = wsOnMessage;
    }

    function wsReconnect() {
        if (wsRef.current) wsRef.current.close();
        clearInterval(wsReconnectInterval.current);
        // todo: actually spams the server with requests, should be fixed
        wsReconnectInterval.current = setInterval(() => {
            wsConnect();
        }, 5000);
    }

    function wsOnOpen() {
        clearInterval(wsReconnectInterval.current);
        console.log('[Router] Connection established');
    }

    function wsOnClose() {
        console.log('[Router] Connection closed, reconnecting...');
        wsReconnect();
    }

    function wsOnError() {
        console.log('[Router] Connection error, reconnecting...');
        wsReconnect();
    }

    async function wsOnMessage(event: MessageEvent) {
        const message = JSON.parse(event.data) as Message;
        await pushMessage(message);
    }

    useEffect(() => {
        if (status !== 'authenticated') return;

        wsConnect();

        return () => {
            if (wsRef.current) wsRef.current.close();
        };
    }, [status]);

    const scrollToBottom = (smooth: boolean = true) => {
        setTimeout(() => {
            // @ts-expect-error - ref is legacy todo: replace
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            messageEndRef.current.scrollIntoView({
                behavior: smooth ? 'smooth' : 'instant',
                block: 'center',
            });
        }, 0);
    };

    const handleSend = () => {
        if (!session || !inputRef.current || !wsRef.current) return;
        const message = inputRef.current.value;
        if (message.trim() !== '') {
            if (wsRef.current && wsRef.current.readyState !== WebSocket.OPEN) {
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 5000);
                return;
            }

            if (!chats[currentChat]) return;

            const chat = chats[currentChat];
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
                            {chats &&
                                chats[currentChat]?.messages?.map((message) => (
                                    <ChatMesssage
                                        key={message.id}
                                        message={message}
                                    />
                                ))}
                            {/*@ts-expect-error - ref is legacy todo: replace*/}
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

const ChatMesssage = ({ message }: { message: Message }) => {
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
