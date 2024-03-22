import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import { Inter } from 'next/font/google';

import { api } from '~/utils/api';

import '~/styles/globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

const App: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <main className="h-screen bg-slate-200">
                <Component {...pageProps} />
            </main>
        </SessionProvider>
    );
};

export default api.withTRPC(App);
