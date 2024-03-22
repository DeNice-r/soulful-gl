import React from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Button from '@mui/material/Button';
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
            <div className="flex basis-1/2 items-center justify-center">
                <NavLink href="/">Home</NavLink>
                {session &&
                    session.user.role >= (UserRole.OPERATOR as number) && (
                        <NavLink href="/drafts">My Drafts</NavLink>
                    )}

                {session &&
                    session.user.role === (UserRole.OPERATOR as number) && (
                        <>
                            <NavLink href="/chat">My chats</NavLink>
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
                            <Link
                                href="/create"
                                className="text-center align-middle"
                            >
                                New post
                            </Link>

                            <button onClick={() => signOut()}>Log out</button>
                        </div>
                    </>
                ) : (
                    <>
                        <Button
                            href="/api/auth/signin"
                            data-active={isActive('/signup')}
                        >
                            Log in
                        </Button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Header;
