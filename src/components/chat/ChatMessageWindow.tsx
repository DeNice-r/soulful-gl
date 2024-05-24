import type { RouterOutputs } from '~/utils/api';
import * as React from 'react';
import { useState } from 'react';

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
} from 'lucide-react';
import { cn } from '~/lib/utils';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '../ui/resizable';
import { Editor } from '../management/common/Editor';
import { ChatTabName as ChatTabType } from '~/utils/types';

export const ChatMessageWindow: React.FC<{
    chats: RouterOutputs['chat']['listFull'];
    currentChat: number;
    handleSend: () => void;
    setMessageText: React.Dispatch<
        React.SetStateAction<string | null | undefined>
    >;
    messageEndRef: React.MutableRefObject<unknown>;
    closeCurrentChatAndReport: () => Promise<void>;
    setCurrentChat: React.Dispatch<React.SetStateAction<number>>;
}> = ({
    chats,
    currentChat,
    handleSend,
    setMessageText,
    messageEndRef,
    closeCurrentChatAndReport,
    setCurrentChat,
}) => {
    const [isWindowOpened, setIsWindowOpened] = useState(false);
    const [tabType, setTabType] = useState<'notes' | 'knowledge' | 'ai'>(
        'notes',
    );

    const [note, setNote] = useState('');

    function handleHelpClick() {
        setIsWindowOpened(!isWindowOpened);
    }

    function handleChatClosing() {
        setCurrentChat(-1);
    }

    function handleTabClick(name: ChatTabType) {
        return () => {
            setIsWindowOpened(tabType !== name || !isWindowOpened);
            setTabType(name);
        };
    }
    return (
        <ResizablePanelGroup direction="horizontal" className="h-screen">
            <ResizablePanel minSize={30} defaultSize={50}>
                <section className="flex h-full w-full flex-col">
                    {currentChat !== -1 && (
                        <>
                            <header className="flex h-16 items-center justify-between border-b p-4 dark:border-zinc-700">
                                <h2 className="flex items-center gap-4 text-xl font-bold">
                                    {chats[currentChat]?.userId}
                                    <OctagonAlert
                                        onClick={() =>
                                            closeCurrentChatAndReport
                                        }
                                        className="w-5 cursor-pointer text-red-600"
                                    />
                                </h2>
                                <div className="flex items-center gap-4">
                                    <X
                                        className="cursor-pointer"
                                        onClick={handleChatClosing}
                                    />
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
                                    <Input
                                        className="flex-1"
                                        placeholder="Введіть повідомлення..."
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
                                        Відправити
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
                        <div
                            className={cn(
                                'flex h-16 w-full cursor-pointer items-center justify-center transition-all',
                            )}
                            onClick={handleHelpClick}
                        >
                            <PanelRight />
                        </div>
                        <div
                            className={cn(
                                'flex h-16 w-full cursor-pointer items-center justify-center transition-all',
                                isWindowOpened &&
                                    tabType === ChatTabType.NOTES &&
                                    'my-2 h-12 w-4/5 rounded-s-xl bg-neutral-300',
                            )}
                            onClick={handleTabClick(ChatTabType.NOTES)}
                        >
                            <NotebookPen />
                        </div>
                        <div
                            className={cn(
                                'flex h-16 w-full cursor-pointer items-center justify-center transition-all',
                                isWindowOpened &&
                                    tabType === ChatTabType.KNOWLEDGE &&
                                    'my-2 h-12 w-4/5 rounded-s-xl bg-neutral-300',
                            )}
                            onClick={handleTabClick(ChatTabType.KNOWLEDGE)}
                        >
                            <BookOpen />
                        </div>
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
                    </div>
                    <div className="h-full w-full">
                        {tabType === ChatTabType.NOTES && (
                            <>
                                <Editor
                                    className="h-full max-h-[calc(100vh-42.84px)] rounded-none border-0 border-none bg-neutral-300"
                                    containerClassName="h-full"
                                    onChange={(note: string) => setNote(note)}
                                />
                                <style>
                                    {`
                                        .ql-toolbar {
                                            background-color: rgb(229 229 229 / var(--tw-bg-opacity));
                                        }
                                        .ql-container {
                                            border-width: 0px !important;
                                        }
                                        .ql-toolbar {
                                            border-width: 0px !important;
                                            border-bottom: 1px solid #ccc !important;
                                            border-left: 1px solid #ccc !important;
                                        }
                                    `}
                                </style>
                            </>
                        )}
                        {tabType === ChatTabType.KNOWLEDGE && (
                            <div>knowledge</div>
                        )}
                        {tabType === ChatTabType.AI && <div>AI</div>}
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
    );
};
