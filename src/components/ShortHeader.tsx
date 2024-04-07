import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Button } from './ui/button';
import { signOut, useSession } from 'next-auth/react';
import { ManagementPageNames } from '~/utils/types';

const PageTitleMap = {
    [ManagementPageNames.USERS]: 'Користувачі',
    [ManagementPageNames.OPERATORS]: 'Оператори',
    [ManagementPageNames.STATISTICS]: 'Статистика',
};

const ShortHeader: React.FC<{ entity?: ManagementPageNames }> = ({
    entity,
}) => {
    const { update: updateSession, data: session, status } = useSession();

    const image = session?.user?.image ?? 'images/placeholder.svg';
    const name = session?.user?.name ?? 'Користувач';

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
            <Link className="lg:hidden" href="/">
                <Package2Icon className="h-6 w-6" />
                <span className="sr-only">Головна</span>
            </Link>
            <div className="w-full">
                <h1 className="text-lg font-semibold">
                    {entity ? PageTitleMap[entity] : 'Керування'}
                </h1>
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        className="h-8 w-8 rounded-full"
                        size="icon"
                        variant="ghost"
                    >
                        <Image
                            alt={`@${name}'s profile`}
                            className="rounded-full"
                            height={32}
                            src={`${image}`}
                            style={{
                                aspectRatio: '32/32',
                                objectFit: 'cover',
                            }}
                            width={32}
                        />
                        <span className="sr-only">
                            Перемикнути користувацьке меню
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="mt-1 flex min-w-56">
                    <div>
                        <div className="flex items-center gap-2 p-3">
                            <Image
                                alt={`@${name}'s profile`}
                                className="rounded-full"
                                height={40}
                                src={`${image}`}
                                style={{
                                    aspectRatio: '40/40',
                                    objectFit: 'cover',
                                }}
                                quality={100}
                                width={40}
                            />
                            <div className="flex flex-col gap-1 text-sm">
                                <div className="font-medium">{name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {session?.user.email}
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-1 p-3">
                            <Link
                                className="flex items-center gap-2 hover:text-slate-600"
                                href="#"
                            >
                                <UserIcon className="h-4 w-4" />
                                Профіль
                            </Link>
                            <Link
                                className="flex items-center gap-2 hover:text-slate-600"
                                href="/management"
                            >
                                {
                                    //add permissions
                                }
                                <CogIcon className="h-4 w-4" />
                                Керування
                            </Link>
                            <Link
                                href="/create"
                                className="flex items-center gap-2 hover:text-slate-600"
                            >
                                <PencilIcon className="h-4 w-4" />
                                Новий допис
                            </Link>
                        </div>
                        <div className="p-3">
                            <Button
                                onClick={() => signOut()}
                                size="sm"
                                variant="destructive"
                                className="transition-colors hover:bg-red-800"
                            >
                                Вихід
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </header>
    );
};

function CogIcon(
    props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
            <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
            <path d="M12 2v2" />
            <path d="M12 22v-2" />
            <path d="m17 20.66-1-1.73" />
            <path d="M11 10.27 7 3.34" />
            <path d="m20.66 17-1.73-1" />
            <path d="m3.34 7 1.73 1" />
            <path d="M14 12h8" />
            <path d="M2 12h2" />
            <path d="m20.66 7-1.73 1" />
            <path d="m3.34 17 1.73-1" />
            <path d="m17 3.34-1 1.73" />
            <path d="m11 13.73-4 6.93" />
        </svg>
    );
}

function PencilIcon(
    props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
        </svg>
    );
}

function UserIcon(
    props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function Package2Icon(
    props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
            <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
            <path d="M12 3v6" />
        </svg>
    );
}

export default ShortHeader;
