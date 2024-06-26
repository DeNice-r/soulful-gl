import React, { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const NavLink = ({
    href,
    children,
    className,
    ...props
}: {
    href: string;
    children: ReactNode; // | ReactNodeArray;
    className?: string;
    props?: never;
}) => {
    const pathname = usePathname();

    const pathnameParts = pathname ? pathname.split('/') : [];
    const isActive = pathname === href || '/' + pathnameParts[1] === href;

    return (
        <Link
            className={`${className} ${isActive ? 'cursor-default font-bold text-slate-600' : 'font-normal hover:text-slate-600'} flex h-16 items-center text-sm md:text-base 2xl:text-lg`}
            href={href}
            passHref
            {...props}
        >
            {children}
        </Link>
    );
};
