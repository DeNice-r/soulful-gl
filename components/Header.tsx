import React from 'react';
import {useRouter} from 'next/router';
import {signOut, useSession} from 'next-auth/react';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";

const Header: React.FC = () => {
    const router = useRouter();
    const isActive: (pathname: string) => boolean = (pathname) =>
        router.pathname === pathname;

    const {data: session, status} = useSession();

    let left = (
        <div className="left">
            <Button variant="text" href="/" data-active={isActive('/')}>Feed</Button>
            {   // @ts-ignore
                (session && session.user.role === "operator") && <>
                <Button href="/drafts" data-active={isActive('/drafts')}>My Drafts</Button>
                <Button href="/chat" data-active={isActive('/chat')}>My chats</Button>
                </>
            }
        </div>
    );

    let right = (
        <Box sx={{marginLeft: 'auto'}}>
            {
                // @ts-ignore
                (session) ?
                    <>
                        <Box component="div" sx={{display: 'inline'}}>
                            {session.user.name} ({session.user.email}) /{// @ts-ignore
                            session.user.role}/
                        </Box>
                        <Button href="/create">
                            New post
                        </Button>

                        <Button onClick={() => signOut()}>
                            Log out
                        </Button>
                    </>
                    :
                    <>
                        <Button href="/api/auth/signin" data-active={isActive('/signup')}>
                            Log in
                        </Button>
                    </>
            }
        </Box>)

    return (
        <nav>
            {left}
            {right}
            <style jsx>{`
              nav {
                display: flex;
                padding: 2rem;
                align-items: center;
              }
            `}</style>
        </nav>
    );
};

export default Header;
