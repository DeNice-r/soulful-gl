import React from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import { IconButton } from '@mui/material';
import NavLink from './NavLink';
import { UserRole } from '~/utils/types';
import Image from 'next/image';
import Link from 'next/link';
import { truculenta } from '~/pages/_app';

const Header: React.FC = () => {
    const { update: updateSession, data: session, status } = useSession();

    const router = useRouter();
    const [currentStatus, setCurrentStatus] = React.useState(
        session?.user?.isOnline || false,
    );
    const isActive: (pathname: string) => boolean = (pathname) =>
        router.pathname === pathname;

    const changeStatus = async () => {
        if (!session) return;

        try {
            const response = await fetch('/api/chat/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isOnline: !session.user.isOnline }),
            });
            await updateSession({
                ...session,
                ...(await response.json()),
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <nav className="flex items-center justify-between p-2 align-middle">
            <div
                className={`${truculenta.className} flex basis-1/4 items-center justify-start text-2xl text-cyan-800`}
            >
                <Link href={'/'}>Soulful</Link>
            </div>
            <div className="flex w-1/4 divide-x-2 divide-slate-200 rounded-lg shadow">
                <NavLink className="rounded-l-md" href="/">
                    Home
                </NavLink>
                {session &&
                    session.user.role > (UserRole.OPERATOR as number) && (
                        <NavLink className="rounded-r-md" href="/drafts">
                            Чернетки
                        </NavLink>
                    )}

                {session &&
                    session.user.role === (UserRole.OPERATOR as number) && (
                        <>
                            <NavLink href="/drafts">Чернетки</NavLink>
                            <NavLink className="rounded-r-md" href="/chat">
                                Чати
                            </NavLink>
                        </>
                    )}
            </div>
            <div className="flex basis-1/4 justify-end">
                {session ? (
                    <>
                        {session.user.role > (UserRole.USER as number) && (
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={changeStatus}
                            >
                                <OnlinePredictionIcon
                                    color={
                                        session.user.isOnline
                                            ? 'success'
                                            : 'warning'
                                    }
                                />
                            </IconButton>
                        )}

                        <div className="flex items-center gap-2">
                            <Image
                                src={session.user.image}
                                alt={`@${session.user.name}'s profile`}
                                className="hidden rounded-full lg:block"
                                width={32}
                                height={32}
                            />
                            <p
                                className="leading-4"
                                title={`${session.user.email}) /
                                ${session.user.role}/`}
                            >{`${session.user.name}`}</p>
                            <Link href="/create" className="btn-primary">
                                Новий допис
                            </Link>

                            <button
                                className="btn-warning uppercase"
                                onClick={() => signOut()}
                            >
                                Вихід
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link
                            href="/api/auth/signin"
                            data-active={isActive('/signup')}
                            className=""
                        >
                            Увійти
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Header;
