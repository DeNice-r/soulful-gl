import React from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import { IconButton } from '@mui/material';
import NavLink from './NavLink';
import { UserRole } from '#types';

const Header: React.FC = () => {
    const { update: updateSession, data: session, status } = useSession();

    const router = useRouter();
    const [currentStatus, setCurrentStatus] = React.useState(
        session?.user?.isOnline || false,
    );
    const isActive: (pathname: string) => boolean = (pathname) =>
        router.pathname === pathname;

    const changeStatus = async () => {
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

    const left = (
        <div className="left">
            <NavLink href="/">Home</NavLink>
            {session && session.user.role >= UserRole.OPERATOR && (
                <NavLink href="/drafts">My Drafts</NavLink>
            )}
            {session && session.user.role === UserRole.OPERATOR && (
                <>
                    <NavLink href="/chat">My chats</NavLink>
                </>
            )}
        </div>
    );

    const right = (
        <Box sx={{ marginLeft: 'auto' }}>
            {session ? (
                <>
                    {session.user.role >= UserRole.USER && (
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
            )}
        </Box>
    );

    return (
        <nav>
            {left}
            {right}
            <style jsx>{`
                nav {
                    display: flex;
                    padding: 0;
                    align-items: center;
                }
            `}</style>
        </nav>
    );
};

export default Header;
