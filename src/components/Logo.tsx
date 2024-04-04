import React from 'react';
import Link from 'next/link';
import { truculenta } from '~/pages/_app';

const Logo = ({
    className,
    ...props
}: {
    className?: string;
    props?: never;
}) => {
    return (
        <div
            className={`${truculenta.className} ${className} items-center justify-start text-2xl text-cyan-800 md:flex`}
            {...props}
        >
            <Link href={'/'}>Soulful</Link>
        </div>
    );
};

export default Logo;
