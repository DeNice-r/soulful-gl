import React from 'react';
import { Header } from './Header';
import { type Props } from '~/utils/types';

export const Layout: React.FC<Props> = (props) => (
    <div className="flex h-screen flex-col">
        <Header />
        <div className="flex-auto">{props.children}</div>
    </div>
);
