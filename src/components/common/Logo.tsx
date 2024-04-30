import React from 'react';
import Link from 'next/link';
import { truculenta } from '~/pages/_app';
import { cn } from '~/lib/utils';

export const Logo = ({
    className,
    ...props
}: {
    className?: string;
    props?: never;
}) => {
    return (
        <div
            className={cn(
                truculenta.className,
                'items-center justify-start text-3xl text-cyan-800 md:flex',
                className,
            )}
            {...props}
        >
            <Link href={'/'}>Soulful</Link>
        </div>
    );
};
