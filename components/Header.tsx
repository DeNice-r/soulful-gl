import React from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import { IconButton } from '@mui/material';
import NavLink from './NavLink';

type Props = {
    onlineStatus: boolean;
};

const Header: React.FC = (props: Props) => {
    const { update: updateSession, data: session, status } = useSession();

    const router = useRouter();
    const [currentStatus, setCurrentStatus] = React.useState(
        session?.user?.status || false,
    );
    const isActive: (pathname: string) => boolean = (pathname) =>
        router.pathname === pathname;

    const changeStatus = async (e: React.SyntheticEvent) => {
        try {
            const response = await fetch('/api/chat/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: !session.user.status }),
            });
            await updateSession({
                ...session,
                status: (await response.json()).status,
            });
        } catch (error) {
            console.error(error);
        }
    };

    let left = (
        <div className="left">
            <NavLink href="/">Home</NavLink>
            {
                // @ts-ignore
                session && session.user.role === 'operator' && (
                    <>
                        <NavLink href="/drafts">My Drafts</NavLink>
                        <NavLink href="/chat">My chats</NavLink>
                    </>
                )
            }
        </div>
    );

    let right = (
        <Box sx={{ marginLeft: 'auto' }}>
            {
                // @ts-ignore
                session ? (
                    <>
                        {session.user.role === 'operator' && (
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={changeStatus}
                            >
                                <OnlinePredictionIcon
                                    color={
                                        session.user.status
                                            ? 'success'
                                            : 'warning'
                                    }
                                />
                            </IconButton>
                        )}
                        <Box component="div" sx={{ display: 'inline' }}>
                            {session.user.name} ({session.user.email}) /
                            {session.user.role}/
                        </Box>
                        <Button href="/create">New post</Button>

                        <Button onClick={() => signOut()}>Log out</Button>
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
                )
            }
        </Box>
    );

    return (
        <nav>
            {left}
            {right}
            <style jsx>{`
                nav {
                    display: flex;
                    padding: 0rem;
                    align-items: center;
                }
            `}</style>
        </nav>
    );
};

export default Header;
