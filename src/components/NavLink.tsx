import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MyLink = ({
    href,
    children,
    className,
    ...props
}: {
    href: string;
    children: any;
    className?: string;
    props?: never;
}) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            className={`${className} ${isActive ? 'cursor-default font-bold text-slate-600' : 'font-normal hover:text-slate-600'} flex h-16 items-center text-sm md:text-base 2xl:text-lg`}
            href={isActive ? '' : href}
            passHref
            {...props}
        >
            {children}
        </Link>
    );
};

export default MyLink;
