import * as React from 'react';
import { useEffect, useRef } from 'react';
import { type Message } from '@prisma/client';
import { Alert, Fade, Grid } from '@mui/material';
import { Layout } from '~/components/common/Layout';
import { useSession } from 'next-auth/react';
import { api, type RouterOutputs } from '~/utils/api';
import { ChatBar } from '~/components/chat/ChatBar';
import { ChatMessageWindow } from '~/components/chat/ChatMessageWindow';
import { Cross1Icon } from '@radix-ui/react-icons';
import { Button } from '@mui/material';
import { LoaderIcon, Trash2Icon } from 'lucide-react';

type FullChats = NonNullable<RouterOutputs['chat']['listFull']>;

const ChatUI = () => {
    const { data: session, status } = useSession();

    const { client: apiClient } = api.useUtils();
    const chatListFullQuery = api.chat.listFull.useQuery(undefined, {
        enabled: false,
    });
    const unassignedChatsQuery = api.chat.listUnassigned.useQuery(undefined, {
        enabled: false,
    });
    const unassignedChatsQueryRef = useRef<NodeJS.Timeout | null>(null);

    const chatsRef = useRef<FullChats>({});
    const [_, changeState] = React.useState<number>(0);

    const unassignedChatsRef = useRef<
        NonNullable<RouterOutputs['chat']['listUnassigned']>
    >([]);

    function rerender() {
        changeState((prevState) => prevState + 1);
    }

    const [error, setError] = React.useState(false);
    const [currentChat, setCurrentChat] = React.useState<number>(-1);

    const inputRef = React.useRef<{ value: string; focus: () => void }>();
    const messageEndRef = React.useRef();

    const wsRef = React.useRef<WebSocket>();
    const wsReconnectInterval = React.useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (
            status !== 'authenticated' ||
            wsRef.current ||
            unassignedChatsQueryRef.current
        )
            return;

        unassignedChatsQueryRef.current = setInterval(() => {
            void unassignedChatsQuery.refetch();
        }, 60_000);
        void unassignedChatsQuery.refetch();

        void wsConnect();

        return () => {
            if (!wsRef.current) return;
            wsRef.current.onclose = null;
            wsRef.current.onerror = null;
            wsRef.current.close();
            delete wsRef.current;
            if (unassignedChatsQueryRef.current)
                clearInterval(unassignedChatsQueryRef.current);
            console.log('[Router] Connection destroyed');
        };
    }, [status]);

    useEffect(() => {
        if (!chatListFullQuery.data) return;

        chatsRef.current = chatListFullQuery.data;
        rerender();
    }, [chatListFullQuery.data]);

    useEffect(() => {
        if (!unassignedChatsQuery.data) return;

        unassignedChatsRef.current = unassignedChatsQuery.data;
        rerender();
    }, [unassignedChatsQuery.data]);

    async function takeUnassignedChat(chatId: number) {
        if (!unassignedChatsRef.current.length) return;

        const chat = await apiClient.chat.getFull.query(chatId);
        chatsRef.current[chat.id] = chat;
        unassignedChatsRef.current = [];
        rerender();
    }

    async function pushMessage(message: Message) {
        if (!session) return;

        if (!(message.chatId in chatsRef.current)) {
            const newChat = await apiClient.chat.getFull.query(message.chatId);
            if (!newChat) return;

            chatsRef.current[message.chatId] = newChat;
        } else {
            chatsRef.current[message.chatId].messages.push(message);
        }

        rerender();

        setTimeout(() => {
            // @ts-expect-error - ref is legacy todo: replace
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            messageEndRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 0);
    }

    async function wsConnect() {
        if (!session) return;

        if (wsRef.current && wsRef.current?.readyState !== WebSocket.CLOSED)
            return;

        const token = await apiClient.user.getAccessToken.query();

        wsRef.current = new WebSocket(
            `${process.env.NEXT_PUBLIC_WSS_ENDPOINT}/${token}`,
        );

        if (!chatListFullQuery.isFetched) void chatListFullQuery.refetch();

        wsRef.current.onopen = wsOnOpen;
        wsRef.current.onclose = wsOnClose;
        wsRef.current.onerror = wsOnError;
        wsRef.current.onmessage = wsOnMessage;
    }

    function wsOnOpen() {
        clearInterval(wsReconnectInterval.current);
        console.log('[Router] Connection established');
    }

    function wsOnClose() {
        console.log('[Router] Connection closed, reconnecting...');
        void wsConnect();
    }

    function wsOnError() {
        console.log('[Router] Connection error, reconnecting...');
        void wsConnect();
    }

    async function wsOnMessage(event: MessageEvent<string>) {
        const message = JSON.parse(event.data) as Message;
        await pushMessage(message);
    }

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

            if (!chatsRef.current[currentChat]) return;

            const chat = chatsRef.current[currentChat];
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
        if (index !== currentChat) setCurrentChat(index);

        scrollToBottom(false);

        if (!inputRef.current) return;
        inputRef.current.focus();
    }

    async function closeCurrentChat() {
        await apiClient.chat.archive.mutate(currentChat);
        setCurrentChat(-1);
        delete chatsRef.current[currentChat];
        rerender();
    }

    async function closeCurrentChatAndReport() {
        await apiClient.chat.report.mutate(currentChat);
        setCurrentChat(-1);
        delete chatsRef.current[currentChat];
        rerender();
    }

    function scrollToBottom(smooth: boolean = true) {
        setTimeout(() => {
            if (messageEndRef.current) {
                // @ts-expect-error - ref is legacy todo: replace
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                messageEndRef.current.scrollIntoView({
                    behavior: smooth ? 'smooth' : 'instant',
                    block: 'center',
                });
            }
        }, 0);
    }

    return (
        <Layout footer={false}>
            <Fade in={error}>
                <Alert
                    variant="filled"
                    severity="warning"
                    sx={{ position: 'absolute', 'z-index': 1 }}
                >
                    Встановлення з&apos;єднання з сервером...
                </Alert>
            </Fade>
            {currentChat !== -1 && (
                <>
                    <Button
                        variant="contained"
                        className="top-15 absolute right-0 z-20"
                        color="error"
                        onClick={closeCurrentChat}
                    >
                        <Cross1Icon />
                    </Button>
                    <Button
                        variant="contained"
                        className="absolute bottom-0 left-0 z-20"
                        color="error"
                        onClick={closeCurrentChatAndReport}
                    >
                        {/*<Trash2Icon />*/}
                        Report
                    </Button>
                </>
            )}
            {unassignedChatsRef.current.length > 0 && (
                <Button
                    variant="contained"
                    className="top-15 absolute left-0 z-20"
                    color="success"
                    onClick={() =>
                        takeUnassignedChat(unassignedChatsRef.current[0].id)
                    }
                >
                    <LoaderIcon />
                </Button>
            )}
            <Grid container spacing={0}>
                <ChatBar chats={chatsRef.current} changeChat={changeChat} />
                <ChatMessageWindow
                    chats={chatsRef.current}
                    {...{
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
