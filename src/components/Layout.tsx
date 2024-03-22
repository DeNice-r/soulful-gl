import React, { type ReactNode } from 'react';
import Header from './Header';

type Props = {
    children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
    <div>
        <Header />
        <div className="px-8">{props.children}</div>
        <style jsx global>{`
            body {
                margin: 0;
                padding: 0;
                font-size: 16px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                    Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                    'Segoe UI Emoji', 'Segoe UI Symbol';
                background: rgba(0, 0, 0, 0.05);
            }
        `}</style>
    </div>
);

export default Layout;
