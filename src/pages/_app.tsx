import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import { Truculenta } from 'next/font/google';

import { api } from '~/utils/api';

import '~/styles/globals.css';
import Head from 'next/head';

export const truculenta = Truculenta({
    subsets: ['latin'],
    weight: '900',
});

const App: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <Head>
                <title>Soulful</title>
            </Head>
            <main className="h-full bg-neutral-50 font-sans">
                <Component {...pageProps} />
            </main>
        </SessionProvider>
    );
};

export default api.withTRPC(App);
