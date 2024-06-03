import { api, type RouterOutputs } from '~/utils/api';
import React, { useEffect, useRef, useState } from 'react';

import { ChatMesssage } from '~/components/chat/ChatMessage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
    X,
    OctagonAlert,
    PanelRight,
    NotebookPen,
    Bot,
    BookOpen,
    SendHorizonal,
    ArchiveX,
    CalendarDays,
    Newspaper,
    RefreshCw,
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { cn } from '~/lib/utils';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '../ui/resizable';
import { Editor } from '../management/common/Editor';
import { ChatTabName as ChatTabType, type EntityData } from '~/utils/types';
import Knowledge from '../knowledge/Knowledge';
import { CustomPagination } from '../utils/CustomPagination';
import { Spinner } from '../ui/spinner';
import { Post } from '../Post';
import { useRouter } from 'next/router';
import { CHAT_POSTS_LAYOUT_LIMIT } from '~/utils/constants';
import { useToast } from '~/components/ui/use-toast';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import { Separator } from '../ui/separator';

export const ChatMessageWindow: React.FC<{
    chats: RouterOutputs['chat']['listFull'];
    currentChat: number;
    handleSend: () => void;
    messageText: string | null | undefined;
    setMessageText: React.Dispatch<
        React.SetStateAction<string | null | undefined>
    >;
    messageEndRef: React.MutableRefObject<unknown>;
    closeCurrentChatAndReport: () => Promise<void>;
    setCurrentChat: React.Dispatch<React.SetStateAction<number>>;
    closeChat: (chatID: number) => Promise<void>;
}> = ({
    chats,
    currentChat,
    handleSend,
    messageText,
    setMessageText,
    messageEndRef,
    closeCurrentChatAndReport,
    setCurrentChat,
    closeChat,
}) => {
    const router = useRouter();

    const [isWindowOpened, setIsWindowOpened] = useState(false);
    const [tabType, setTabType] = useState<ChatTabType>(ChatTabType.NOTES);

    const [notes, setNotes] = useState<string | undefined>();
    const [help, setHelp] = useState<string[] | undefined>();

    const [currentEntity, setCurrentEntity] = useState<EntityData>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);

    const [_, setState] = useState(0);

    const { toast } = useToast();

    const userNotesMutation = api.user.notes.useMutation();
    const listHelpQuery = api.chat.listHelp.useQuery(currentChat, {
        enabled: false,
    });
    const getHelpMutation = api.chat.getHelp.useMutation();

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    function handleHelpClick() {
        setIsWindowOpened(!isWindowOpened);
    }

    function handleChatClosing() {
        isWindowOpened && setIsWindowOpened(false);
        setCurrentChat(-1);
    }

    function handleTabClick(name: ChatTabType) {
        return () => {
            setIsWindowOpened(tabType !== name || !isWindowOpened);
            setTabType(name);
        };
    }

    function debounce(fn: () => void, ms: number) {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(fn, ms);
    }

    const limit = !isNaN(Number(router.query.limit))
        ? Number(router.query.limit)
        : CHAT_POSTS_LAYOUT_LIMIT;

    const posts = api.post.list.useQuery({ limit, page: currentPage });

    const total = posts.data?.count ? Math.ceil(posts.data.count / limit) : 0;

    function rerender() {
        setState((prev) => prev + 1);
    }

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const debounceNotes = (value: string) => {
        if (!value || !notes || value === notes) return;
        setNotes(value);
        debounce(() => {
            void userNotesMutation.mutateAsync({
                id: chats[currentChat].userId,
                notes: notes,
            });
            toast({ title: '✅ Нотатки збережено' });
        }, 1000);
    };

    useEffect(() => {
        if (posts.data) rerender();
    }, [posts.data]);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        void (async () => {
            if (currentChat === -1) {
                setNotes('');
                return;
            }
            setHelp(undefined);
            setNotes(undefined);

            await listHelpQuery.refetch();
            setNotes(
                (
                    await userNotesMutation.mutateAsync({
                        id: chats[currentChat].userId,
                    })
                ).notes ?? '',
            );
        })();
    }, [currentChat]);

    useEffect(() => {
        if (listHelpQuery.data)
            setHelp(listHelpQuery.data.map((help) => help.text));
    }, [listHelpQuery.data]);

    async function refetchAI() {
        if (currentChat === -1) return;
        try {
            const newHelp = await getHelpMutation.mutateAsync(currentChat);
            setHelp([...(help ?? []), newHelp.text]);
        } catch (e) {
            toast({
                title: 'Помилка',
                description:
                    e instanceof Error ? e.message : 'Невідома помилка',
                variant: 'destructive',
            });
        }
    }

    return (
        <TooltipProvider>
            <ResizablePanelGroup direction="horizontal" className="h-screen">
                <ResizablePanel minSize={30} defaultSize={50}>
                    <section className="flex h-full w-full flex-col">
                        {currentChat !== -1 && (
                            <>
                                <header className="flex h-16 items-center justify-between border-b p-4 dark:border-zinc-700">
                                    <h2 className="flex items-center gap-4 text-xl font-bold">
                                        {chats[currentChat]?.userId}
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <OctagonAlert
                                                    onClick={() =>
                                                        closeCurrentChatAndReport
                                                    }
                                                    className="w-5 cursor-pointer text-red-600"
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent className="font-normal">
                                                Поскаржитись
                                            </TooltipContent>
                                        </Tooltip>
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <AlertDialog>
                                            <Tooltip>
                                                <TooltipTrigger className="flex h-full items-center">
                                                    <AlertDialogTrigger>
                                                        <ArchiveX className="cursor-pointer text-red-600" />
                                                    </AlertDialogTrigger>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Заархівувати
                                                </TooltipContent>
                                            </Tooltip>

                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Ви впевнені, що бажаєте
                                                        заархівувати чат?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Ця дія є незворотною.
                                                        Після підтвердження чат
                                                        буде заархівовано та до
                                                        нього не буде доступу.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Відмінити
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-red-700"
                                                        onClick={() =>
                                                            closeChat(
                                                                currentChat,
                                                            )
                                                        }
                                                    >
                                                        Заархівувати
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <X
                                                    className="cursor-pointer"
                                                    onClick={handleChatClosing}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Закрити вікно чату
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </header>
                                <main className="relative flex-1 overflow-auto p-4">
                                    <div className="space-y-4">
                                        {chats[currentChat]?.messages?.map(
                                            (message) => (
                                                <ChatMesssage
                                                    key={message.id}
                                                    message={message}
                                                />
                                            ),
                                        )}
                                        {/*@ts-expect-error - ref is legacy todo: replace*/}
                                        <div ref={messageEndRef}></div>
                                    </div>
                                </main>
                                <footer className="border-t p-4 dark:border-zinc-700">
                                    <div className="flex items-center gap-2">
                                        {/* <Button
                                        onClick={() =>
                                            setIsExerciseDialog(true)
                                        }
                                        className="rounded-full bg-neutral-50 px-1.5 text-neutral-800 shadow-none hover:bg-neutral-200"
                                    >
                                        <Plus />
                                    </Button> */}
                                        <Input
                                            className="flex-1"
                                            placeholder="Введіть повідомлення..."
                                            value={messageText ?? ''}
                                            onChange={(e) => {
                                                setMessageText(e.target.value);
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter') {
                                                    handleSend();
                                                    event.currentTarget.focus(
                                                        undefined,
                                                    );
                                                }
                                            }}
                                        />
                                        {/* <ChatInput {...{ handleSend, inputRef }} /> */}
                                        <Button onClick={handleSend}>
                                            <SendHorizonal />
                                        </Button>
                                    </div>
                                </footer>
                            </>
                        )}
                    </section>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel
                    defaultSize={50}
                    minSize={30}
                    className={cn(
                        'flex bg-neutral-300',
                        !isWindowOpened && currentChat === -1 && 'max-w-0',
                        !isWindowOpened && currentChat > -1 && 'max-w-12',
                    )}
                >
                    <div className="flex h-full w-full">
                        <div className="flex h-full min-w-12 flex-col items-end bg-neutral-200">
                            <Tooltip>
                                <TooltipTrigger className="flex w-full justify-end">
                                    <div
                                        className={cn(
                                            'flex h-16 w-full cursor-pointer items-center justify-center transition-all',
                                        )}
                                        onClick={handleHelpClick}
                                    >
                                        <PanelRight />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Бічна панель</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger className="flex w-full justify-end">
                                    <div
                                        className={cn(
                                            'flex h-16 w-full cursor-pointer items-center justify-center transition-all',
                                            isWindowOpened &&
                                                tabType === ChatTabType.NOTES &&
                                                'my-2 h-12 w-4/5 rounded-s-xl bg-neutral-300',
                                        )}
                                        onClick={handleTabClick(
                                            ChatTabType.NOTES,
                                        )}
                                    >
                                        <NotebookPen />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Нотатки</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger className="flex w-full justify-end">
                                    <div
                                        className={cn(
                                            'flex h-16 w-full cursor-pointer items-center justify-center transition-all',
                                            isWindowOpened &&
                                                tabType ===
                                                    ChatTabType.KNOWLEDGE &&
                                                'my-2 h-12 w-4/5 rounded-s-xl bg-neutral-300',
                                        )}
                                        onClick={handleTabClick(
                                            ChatTabType.KNOWLEDGE,
                                        )}
                                    >
                                        <BookOpen />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>База знань</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger className="flex w-full justify-end">
                                    <div
                                        className={cn(
                                            'flex h-16 w-full cursor-pointer items-center justify-center transition-all',
                                            isWindowOpened &&
                                                tabType ===
                                                    ChatTabType.EXERCISES &&
                                                'my-2 h-12 w-4/5 rounded-s-xl bg-neutral-300',
                                        )}
                                        onClick={handleTabClick(
                                            ChatTabType.EXERCISES,
                                        )}
                                    >
                                        <CalendarDays />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Вправи</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger className="flex w-full justify-end">
                                    <div
                                        className={cn(
                                            'flex h-16 w-full cursor-pointer items-center justify-center transition-all',
                                            isWindowOpened &&
                                                tabType === ChatTabType.POSTS &&
                                                'my-2 h-12 w-4/5 rounded-s-xl bg-neutral-300',
                                        )}
                                        onClick={handleTabClick(
                                            ChatTabType.POSTS,
                                        )}
                                    >
                                        <Newspaper />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Дописи</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger className="flex w-full justify-end">
                                    <div
                                        className={cn(
                                            'flex h-16 w-full cursor-pointer items-center justify-center transition-all',
                                            isWindowOpened &&
                                                tabType === ChatTabType.AI &&
                                                'my-2 h-12 w-4/5 rounded-s-xl bg-neutral-300',
                                        )}
                                        onClick={handleTabClick(ChatTabType.AI)}
                                    >
                                        <Bot />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>ШІ</TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="h-full w-full">
                            {tabType === ChatTabType.NOTES && (
                                <>
                                    {/* todo: parse notes */}
                                    {notes ? (
                                        <Editor
                                            className="fadeIn h-full max-h-[calc(100vh-42.84px)] rounded-none border-0 border-none bg-neutral-300"
                                            containerClassName="h-full"
                                            value={notes}
                                            onChange={debounceNotes}
                                            emitOnOutsideChanges={false}
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <Spinner size="large" />
                                        </div>
                                    )}
                                    <style>
                                        {`
                                        .ql-container {
                                            border-width: 0px !important;
                                        }
                                        .ql-toolbar {
                                            border-width: 0px !important;
                                            border-bottom: 1px solid #ccc !important;
                                            border-left: 1px solid #ccc !important;
                                            background-color: rgb(229 229 229 / var(--tw-bg-opacity));
                                        }
                                    `}
                                    </style>
                                </>
                            )}
                            {tabType === ChatTabType.KNOWLEDGE && (
                                // <div className="h-full w-full">
                                //     <Label className="relative">
                                //         <Input
                                //             placeholder="Введіть назву файлу..."
                                //             className="rounded-none border-0 border-b border-l border-neutral-500 bg-neutral-200 text-neutral-800 focus-visible:ring-0 focus-visible:ring-offset-0"
                                //         />
                                //         <Search className="absolute end-4 top-0 flex h-full items-center text-neutral-500" />
                                //     </Label>
                                <Knowledge
                                    chat={true}
                                    {...{
                                        currentEntity,
                                        setCurrentEntity,
                                    }}
                                />
                                // </div>
                            )}
                            {tabType === ChatTabType.EXERCISES && (
                                <p>Exercises</p>
                            )}
                            {tabType === ChatTabType.POSTS && (
                                <div className="flex h-full w-full flex-col gap-4 overflow-y-auto p-8">
                                    <div className="flex flex-grow flex-wrap justify-center gap-4">
                                        {posts?.data?.values.map((post) => (
                                            <div
                                                key={post.id}
                                                className="flex max-h-[26rem] w-full min-w-52 max-w-[25rem] flex-grow justify-center rounded-md bg-neutral-200 shadow-md outline-2 outline-neutral-200 transition-shadow duration-100 ease-in hover:cursor-pointer hover:shadow-xl hover:outline xl:w-5/12"
                                            >
                                                <Post
                                                    variant="chat"
                                                    post={post}
                                                />
                                            </div>
                                        ))}
                                        {!posts.data && (
                                            <div className="h-full w-full">
                                                <Spinner size="large" />
                                            </div>
                                        )}
                                    </div>
                                    <CustomPagination
                                        page={currentPage}
                                        total={total}
                                        goToPage={goToPage}
                                    />
                                </div>
                            )}
                            {tabType === ChatTabType.AI && (
                                <div className="flex h-full items-start justify-center">
                                    <div className="flex h-full flex-col items-center gap-8 overflow-y-auto p-8">
                                        {help?.map((content, index1, y) => {
                                            return (
                                                <>
                                                    <div
                                                        key={index1}
                                                        className="space-y-2 text-justify"
                                                    >
                                                        {content
                                                            .split('\n')
                                                            .map(
                                                                (
                                                                    article,
                                                                    index2,
                                                                ) => {
                                                                    return (
                                                                        <p
                                                                            key={
                                                                                index1 *
                                                                                    100 +
                                                                                index2
                                                                            }
                                                                        >
                                                                            {
                                                                                article
                                                                            }
                                                                        </p>
                                                                    );
                                                                },
                                                            )}
                                                    </div>
                                                    {index1 !==
                                                        y.length - 1 && (
                                                        <Separator className="my-4 bg-neutral-800" />
                                                    )}
                                                </>
                                            );
                                        })}
                                        {/* todo: AI refetch */}
                                        <Button
                                            className="flex gap-2"
                                            onClick={refetchAI}
                                        >
                                            Запросити аналіз чату
                                            <RefreshCw className="h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <style>
                        {`
                        html {
                            overflow-y: auto;
                        }
                    `}
                    </style>
                </ResizablePanel>
            </ResizablePanelGroup>
        </TooltipProvider>
    );
};
