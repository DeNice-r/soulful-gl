import React from 'react';
import Header from './Header';
import { type Props } from '~/utils/types';

const Layout: React.FC<Props> = (props) => (
    <div className="flex h-screen flex-col">
        <Header />
        <div className="flex-auto">{props.children}</div>
    </div>
);

export default Layout;
