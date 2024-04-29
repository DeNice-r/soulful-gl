import React from 'react';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import {
    PopoverTrigger,
    PopoverContent,
    Popover,
} from '~/components/ui/popover';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import NavLink from './NavLink';
import Logo from './Logo';

const Header: React.FC = () => {
    const { data: session } = useSession();

    const image = session?.user?.image ?? 'images/placeholder.svg';
    const name = session?.user?.name ?? 'Користувач';

    const router = useRouter();
    // const [currentStatus, setCurrentStatus] = React.useState(
    //     session?.user?.isOnline || false,
    // );
    const isActive: (pathname: string) => boolean = (pathname) =>
        router.pathname === pathname;

    // const changeStatus = async () => {
    //     if (!session) return;
    //
    //     try {
    //         const response = await fetch('/api/chat/status', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ isOnline: !session.user.isOnline }),
    //         });
    //         await updateSession({
    //             ...session,
    //             ...(await response.json()),
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };
    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-gray-50 px-4 dark:bg-gray-950 sm:px-6 lg:px-8">
            <Logo className="hidden md:basis-1/4" />
            <nav className="flex justify-center gap-4 lg:gap-8">
                {
                    // session.user.role === (UserRole.OPERATOR as number) &&
                    // todo: use permissions
                }
                <NavLink href="/posts">Дописи</NavLink>
                <NavLink href="/exercises">Вправи</NavLink>
                <NavLink href="/knowledge">База знань</NavLink>
                <NavLink href="/QnA">Запитання та відповіді</NavLink>
                <NavLink href="/chat">Чати</NavLink>
            </nav>
            {session ? (
                <div className="flex items-center justify-end gap-4 md:basis-1/4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                className="h-8 w-8 rounded-full border-2 border-gray-100"
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
                                    Toggle user menu
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
                                        <div className="font-medium">
                                            {name}
                                        </div>
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
                </div>
            ) : (
                <>
                    <Link
                        href="/api/auth/signin"
                        data-active={isActive('/signup')}
                        className="flex basis-1/4 justify-end hover:text-sky-500"
                    >
                        Увійти
                    </Link>
                </>
            )}
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

export default Header;
