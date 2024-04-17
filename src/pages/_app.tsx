import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import { Inter, Truculenta } from 'next/font/google';

import { api } from '~/utils/api';

import '~/styles/globals.css';

export const truculenta = Truculenta({
    subsets: ['latin'],
    weight: '900',
});

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
            <main className="h-full bg-neutral-200 font-sans">
                <Component {...pageProps} />
            </main>
        </SessionProvider>
    );
};

export default api.withTRPC(App);
