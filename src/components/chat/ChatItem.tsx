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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import { truncateString } from '~/utils';

interface ChatItemProps {
    chat: ExtendedChat;
    onClick: (e: React.SyntheticEvent) => void;
    closeChat: (chatID: number) => Promise<void>;
    currentChat: number;
    unreadCounter?: number;
}

const ChatItem: React.FC<ChatItemProps> = ({
    onClick,
    chat,
    closeChat,
    currentChat,
    unreadCounter,
}) => {
    return (
        <div
            className={cn(
                'group flex h-24 w-full rounded-2xl border',
                currentChat === chat.id && 'bg-neutral-200',
            )}
        >
            <div
                className="flex-grow cursor-pointer space-y-2 truncate p-4"
                onClick={onClick}
            >
                <div className="flex items-center gap-2">
                    <h1 className="font-medium">Чат #{chat.id}</h1>
                    <div className="flex items-center gap-1">
                        {unreadCounter !== undefined && unreadCounter > 0 && (
                            <div className="h-3 w-3 rounded-full bg-sky-500 text-sm" />
                        )}
                        {unreadCounter !== undefined && unreadCounter > 1 && (
                            <span className="text-sm text-sky-500">
                                {unreadCounter}
                            </span>
                        )}
                    </div>
                </div>
                <p className="truncate">
                    {/*{chat.lastMessage}*/}
                    {chat?.messages?.length > 0 &&
                        truncateString(chat.messages.slice(-1)[0].text, 20)}
                </p>
            </div>
            <div
                className={cn(
                    'invisible flex h-full w-24 cursor-pointer items-center justify-center transition-colors hover:text-red-600 group-hover:visible',
                    currentChat === chat.id && 'w-0 group-hover:invisible',
                )}
            >
                <AlertDialog>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <AlertDialogTrigger>
                                    <ArchiveX />
                                </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Заархівувати</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
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
