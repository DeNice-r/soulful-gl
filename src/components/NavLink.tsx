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
            className={`${className} ${isActive ? 'bg-neutral-200' : 'bg-neutral-400'} grow basis-1`}
            href={isActive ? '' : href}
            passHref
            {...props}
        >
            <button
                className={`${isActive ? 'nav-btn-active' : 'nav-btn-primary'} ${className} w-full`}
            >
                {children}
            </button>
        </Link>
    );
};

export default MyLink;
