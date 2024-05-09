import React from 'react';
import { Header } from './Header';
import { type Props } from '~/utils/types';
import { Toaster } from '~/components/ui/toaster';

export const Layout: React.FC<Props> = (props) => (
    <div className="flex h-screen flex-col">
        <Header />
        <div className="flex-auto">{props.children}</div>
        <Toaster />
    </div>
);
