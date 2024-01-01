import {SessionProvider} from 'next-auth/react';
import {AppProps} from 'next/app';
import {DevSupport} from "@react-buddy/ide-toolbox-next";
import {ComponentPreviews, useInitial} from "../dev";

const App = ({Component, pageProps}: AppProps) => {
    return (
        <SessionProvider session={pageProps.session}>
            <DevSupport ComponentPreviews={ComponentPreviews}
                        useInitialHook={useInitial}
            >
                <Component {...pageProps} />
            </DevSupport>
        </SessionProvider>
    );
};

export default App;
