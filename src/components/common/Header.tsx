import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { NavLink } from '../utils/NavLink';
import { Logo } from './Logo';
import ProfilePopup from './ProfilePopup';

export const Header: React.FC = () => {
    const { data: session } = useSession();

    const router = useRouter();

    const isActive: (pathname: string) => boolean = (pathname) =>
        router.pathname === pathname;

    return (
        <header className="sticky top-0 z-10 flex justify-center border-b bg-neutral-200 drop-shadow-sm dark:bg-gray-950">
            <div className="flex h-16 w-2/3 items-center justify-between">
                <Logo className="hidden" />
                <nav className="flex basis-3/5 justify-center gap-4 lg:gap-8">
                    {
                        // session.user.role === (UserRole.OPERATOR as number) &&
                        // todo: use permissions
                    }
                    <NavLink href="/posts">Дописи</NavLink>
                    <NavLink href="/exercises">Вправи</NavLink>
                    <NavLink href="/knowledge/f">База знань</NavLink>
                    <NavLink href="/QnA">Запитання та відповіді</NavLink>
                    <NavLink href="/chat">Чати</NavLink>
                    <NavLink href="/donate">Підтримати</NavLink>
                </nav>
                {session ? (
                    <div className="flex items-center justify-end gap-4">
                        <ProfilePopup />
                    </div>
                ) : (
                    <>
                        <Link
                            href="/api/auth/signin"
                            data-active={isActive('/signup')}
                            className="flex justify-end hover:text-sky-500"
                        >
                            Увійти
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};
