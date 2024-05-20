import React, { type ReactNode } from 'react';
import { Header } from './Header';
import { Toaster } from '~/components/ui/toaster';
import { Footer } from './Footer';
import { cn } from '~/lib/utils';

export const Layout: React.FC<{
    children?: ReactNode;
    className?: string;
    footer?: boolean;
}> = ({ className, footer = true, ...props }) => (
    <div className="flex min-h-screen flex-col">
        <Header />
        <div className={cn('flex flex-auto justify-center', className)}>
            {props.children}
        </div>
        <Toaster />
        {footer && <Footer />}
    </div>
);
