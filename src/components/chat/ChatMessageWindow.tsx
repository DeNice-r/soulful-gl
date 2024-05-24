import type { RouterOutputs } from '~/utils/api';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { ChatMesssage } from '~/components/chat/ChatMessage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { OctagonAlert, X, NotebookPen, BadgeHelp } from 'lucide-react';
import { cn } from '~/lib/utils';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '../ui/resizable';

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
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const [wasWindowOpened, setWasWindowOpened] = useState(false);

    useEffect(() => {
        if (wasWindowOpened) {
            changeWindowState();
        }
    }, [wasWindowOpened]);

    function changeWindowState() {
        setIsWindowOpen(!isWindowOpen);
    }

    function handleHelpClick() {
        setIsHelpOpen(!isHelpOpen);
        if (!isNotesOpen) {
            changeWindowState();
        } else {
            setIsNotesOpen(!isNotesOpen);
        }
    }

    function handleNotesClick() {
        setIsNotesOpen(!isNotesOpen);
        if (!isHelpOpen) {
            changeWindowState();
        } else {
            setIsHelpOpen(!isHelpOpen);
        }
    }

    function handleChatClosing() {
        if (isWindowOpen) {
            setWasWindowOpened(true);
            changeWindowState();
        }
        setCurrentChat(-1);
    }
    return (
        <ResizablePanelGroup direction="horizontal" className="h-screen">
            <ResizablePanel minSize={40} defaultSize={50}>
                <section className="flex h-full w-full flex-col">
                    {currentChat !== -1 && (
                        <>
                            <header className="flex h-20 items-center justify-between border-b p-4 dark:border-zinc-700">
                                <h2 className="flex items-center gap-4 text-xl font-bold">
                                    {chats[currentChat]?.userId}
                                    <div
                                        className={cn(
                                            'rounded-xl p-2 hover:bg-neutral-200',
                                            isNotesOpen &&
                                                'bg-neutral-300 hover:bg-neutral-200',
                                        )}
                                        onClick={handleNotesClick}
                                    >
                                        <NotebookPen className="w-5 cursor-pointer" />
                                    </div>

                                    <OctagonAlert
                                        onClick={() =>
                                            closeCurrentChatAndReport
                                        }
                                        className="w-5 cursor-pointer text-red-600"
                                    />
                                </h2>
                                <div className="flex items-center gap-4">
                                    <div
                                        className={cn(
                                            'rounded-xl p-2 hover:bg-neutral-200',
                                            isHelpOpen &&
                                                'bg-neutral-300 hover:bg-neutral-200',
                                        )}
                                        onClick={handleHelpClick}
                                    >
                                        <BadgeHelp />
                                    </div>
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
                maxSize={60}
                defaultSize={50}
                minSize={40}
                className={cn(!isWindowOpen && 'max-w-0')}
            ></ResizablePanel>
        </ResizablePanelGroup>
    );
};
