import { type ExtendedChat } from '~/utils/types';
import React from 'react';
import { ArchiveX } from 'lucide-react';
import { cn } from '~/lib/utils';
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

interface ChatItemProps {
    chat: ExtendedChat;
    onClick: (e: React.SyntheticEvent) => void;
    closeChat: (chatID: number) => Promise<void>;
    currentChat: number;
}

const ChatItem: React.FC<ChatItemProps> = ({
    onClick,
    chat,
    closeChat,
    currentChat,
}) => {
    return (
        <div
            className={cn(
                'group flex h-24 rounded-2xl border',
                currentChat === chat.id && 'bg-neutral-200',
            )}
        >
            <div
                className="flex flex-grow cursor-pointer flex-col gap-2 p-4"
                onClick={onClick}
            >
                <h1 className="font-medium">Чат #{chat.id}</h1>
                <p>
                    {/*{chat.lastMessage}*/}
                    {chat?.messages?.length > 0 &&
                        chat.messages.slice(-1)[0].text}
                </p>
            </div>
            <div
                className={cn(
                    'invisible flex h-full w-12 cursor-pointer items-center justify-center transition-colors hover:text-red-600 group-hover:visible',
                    currentChat === chat.id && 'w-0 group-hover:invisible',
                )}
            >
                <AlertDialog>
                    <AlertDialogTrigger>
                        <ArchiveX />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Ви впевнені, що бажаєте заархівувати чат?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Ця дія є незворотною. Після підтвердження чат
                                буде заархівовано та до нього не буде доступу.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Відмінити</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-700"
                                onClick={() => closeChat(chat.id)}
                            >
                                Заархівувати
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default ChatItem;
