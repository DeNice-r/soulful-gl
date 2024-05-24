import type { RouterOutputs } from '~/utils/api';
import * as React from 'react';
import { ChatMesssage } from '~/components/chat/ChatMessage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { OctagonAlert, X } from 'lucide-react';

export const ChatMessageWindow = ({
    chats,
    currentChat,
    handleSend,
    setMessageText,
    messageEndRef,
    closeCurrentChatAndReport,
    setCurrentChat,
}: {
    chats: RouterOutputs['chat']['listFull'];
    currentChat: number;
    handleSend: () => void;
    setMessageText: React.Dispatch<
        React.SetStateAction<string | null | undefined>
    >;
    messageEndRef: React.MutableRefObject<unknown>;
    closeCurrentChatAndReport: () => Promise<void>;
    setCurrentChat: React.Dispatch<React.SetStateAction<number>>;
}) => (
    <section className="flex h-full w-full flex-col">
        {currentChat !== -1 && (
            <>
                <header className="flex items-center justify-between border-b p-4 dark:border-zinc-700">
                    <h2 className="flex items-center gap-4 text-xl font-bold">
                        {chats[currentChat]?.userId}
                        <OctagonAlert
                            onClick={() => closeCurrentChatAndReport}
                            className="w-5 cursor-pointer text-red-600"
                        />
                    </h2>
                    <X
                        className="cursor-pointer"
                        onClick={() => setCurrentChat(-1)}
                    />
                </header>

                <main className="relative flex-1 overflow-auto p-4">
                    <div className="space-y-4">
                        {chats[currentChat]?.messages?.map((message) => (
                            <ChatMesssage key={message.id} message={message} />
                        ))}
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
                                    event.currentTarget.focus(undefined);
                                }
                            }}
                        />
                        {/* <ChatInput {...{ handleSend, inputRef }} /> */}
                        <Button onClick={handleSend}>Відправити</Button>
                    </div>
                </footer>
            </>
        )}
    </section>
);
