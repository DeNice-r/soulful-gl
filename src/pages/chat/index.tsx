import * as React from 'react';
import { useEffect } from 'react';
import { type Message } from '@prisma/client';
import { Alert, Fade, Grid } from '@mui/material';
import Layout from '../../components/Layout';
import { useSession } from 'next-auth/react';
import { api, type RouterOutputs } from '~/utils/api';
import { ChatBar } from '~/components/chat/ChatBar';
import { ChatMessageWindow } from '~/components/chat/ChatMessageWindow';

const ChatUI = () => {
    const { data: session, status } = useSession();

    const { client: apiClient } = api.useContext();
    const chatListFullQuery = api.chat.listFull.useQuery();

    const [chats, setChats] = React.useState<RouterOutputs['chat']['listFull']>(
        {},
    );

    const [error, setError] = React.useState(false);
    const [currentChat, setCurrentChat] = React.useState<number>(-1);

    const inputRef = React.useRef<{ value: string; focus: () => void }>();
    const messageEndRef = React.useRef();

    const wsRef = React.useRef<WebSocket>();
    const wsReconnectInterval = React.useRef<NodeJS.Timeout>();

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

    function changeChat(index: number) {
        setCurrentChat(index);
        scrollToBottom(false);
    }

    return (
        <Layout>
            <Fade in={error}>
                <Alert
                    variant="filled"
                    severity="warning"
                    sx={{ position: 'absolute', 'z-index': 1 }}
                >
                    Establishing connection to the server...
                </Alert>
            </Fade>
            <Grid container spacing={0}>
                <ChatBar {...{ chats, changeChat }} />
                <ChatMessageWindow
                    {...{
                        chats,
                        currentChat,
                        handleSend,
                        inputRef,
                        messageEndRef,
                    }}
                />
            </Grid>
        </Layout>
    );
};

export default ChatUI;
