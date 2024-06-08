import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { type Message } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { api, type RouterOutputs } from '~/utils/api';
import { ChatBar } from '~/components/chat/ChatBar';
import { ChatMessageWindow } from '~/components/chat/ChatMessageWindow';
import { Button } from '~/components/ui/button';
import { LoaderIcon } from 'lucide-react';
import { Logo } from '~/components/common/Logo';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '~/components/ui/resizable';

// @ts-expect-error no types included in library
import useSound from 'use-sound';
import { Toaster } from '~/components/ui/toaster';
import { useToast } from '~/components/ui/use-toast';
import { type UnreadMessages } from '~/utils/types';
import Head from 'next/head';

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

    const { toast } = useToast();

    const unassignedChatsQueryRef = useRef<NodeJS.Timeout | null>(null);

    const chatsRef = useRef<FullChats>({});
    const [_, changeState] = useState<number>(0);

    const unassignedChatsRef = useRef<
        NonNullable<RouterOutputs['chat']['listUnassigned']>
    >([]);

    function rerender() {
        changeState((prevState) => prevState + 1);
    }

    const [currentChat, setCurrentChat] = useState<number>(-1);

    const inputRef = useRef<HTMLInputElement | null>();
    const messageEndRef = useRef();

    const wsRef = useRef<WebSocket>();
    const wsReconnectInterval = useRef<NodeJS.Timeout>();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const [notification] = useSound('/sounds/notification.mp3', {
        volume: 0.3,
        interrupt: true,
    });

    const [messageText, setMessageText] = useState<string | null>();

    const [unreadMessages, setUnreadMessages] = useState<UnreadMessages>(null);

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

        scrollToBottom();
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
        if (message.isFromUser && message.chatId !== currentChat) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            notification();
            setUnreadMessages((prev) => {
                if (prev === null) {
                    return [{ id: message.chatId, counter: 1 }];
                }

                const chatIndex = prev.findIndex(
                    (chat) => chat?.id === message.chatId,
                );
                if (chatIndex !== -1) {
                    const newUnreadMessages = [...prev];
                    newUnreadMessages[chatIndex] = {
                        ...newUnreadMessages[chatIndex],
                        counter: newUnreadMessages[chatIndex].counter + 1,
                    };
                    return newUnreadMessages;
                } else {
                    return [...prev, { id: message.chatId, counter: 1 }];
                }
            });
        }
    }

    const handleSend = () => {
        if (!messageText) return;
        if (
            !session ||
            !wsRef.current ||
            wsRef.current.readyState !== WebSocket.OPEN
        ) {
            toast({
                title: `З'єднання з сервером не встановлено`,
                variant: 'destructive',
            });
            return;
        }
        if (messageText.trim() !== '') {
            if (!chatsRef.current[currentChat]) return;

            const chat = chatsRef.current[currentChat];
            wsRef.current.send(
                JSON.stringify({
                    text: messageText,
                    userId: chat.userId,
                    chatId: chat.id,
                    isFromUser: false,
                }),
            );
        }
        setMessageText('');
        scrollToBottom();
    };

    function changeChat(index: number) {
        if (index !== currentChat) setCurrentChat(index);

        if (index === -1) return;

        setUnreadMessages((prev) => {
            if (prev === null) {
                return null;
            }

            const chatIndex = prev.findIndex((chat) => chat?.id === index);
            if (chatIndex !== -1) {
                const newUnreadMessages = [...prev];
                delete newUnreadMessages[chatIndex];
                return newUnreadMessages;
            } else {
                return [...prev];
            }
        });

        setMessageText('');

        scrollToBottom(false);

        if (!inputRef.current) return;
        inputRef.current.focus();
    }

    async function closeChat(chatID: number) {
        await apiClient.chat.archive.mutate(chatID);
        setCurrentChat(-1);
        delete chatsRef.current[chatID];
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
        <ResizablePanelGroup
            direction="horizontal"
            className="flex max-h-screen min-h-screen"
        >
            <Head>
                <title>Чати</title>
            </Head>
            <Toaster />
            <ResizablePanel
                className="relative flex h-screen min-w-56 flex-col"
                defaultSize={20}
                minSize={20}
                maxSize={33}
            >
                <Logo className="min-h-16 px-4" />
                <ChatBar
                    chats={chatsRef.current}
                    {...{ changeChat, closeChat, currentChat, unreadMessages }}
                />
                {unassignedChatsRef.current.length > 0 && (
                    <Button
                        className="absolute bottom-0 w-full rounded-none bg-green-800 py-6 hover:bg-green-700"
                        onClick={() =>
                            takeUnassignedChat(unassignedChatsRef.current[0].id)
                        }
                    >
                        <LoaderIcon />
                    </Button>
                )}
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
                <ChatMessageWindow
                    chats={chatsRef.current}
                    {...{
                        messageText,
                        currentChat,
                        handleSend,
                        setMessageText,
                        messageEndRef,
                        closeCurrentChatAndReport,
                        setCurrentChat,
                        closeChat,
                    }}
                />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};

export default ChatUI;
