import React, { type ReactNode } from 'react';
import Header from './Header';

type Props = {
    children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
    <div className="flex h-screen flex-col">
        <Header />
        <div className="flex-auto">{props.children}</div>
    </div>
);

export default Layout;
