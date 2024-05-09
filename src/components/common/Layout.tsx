import React from 'react';
import { Header } from './Header';
import { type Props } from '~/utils/types';
import { Toaster } from '~/components/ui/toaster';
import { Footer } from './Footer';

export const Layout: React.FC<Props> = (props) => (
    <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-auto justify-center">{props.children}</div>
        <Toaster />
        <Footer />
    </div>
);
