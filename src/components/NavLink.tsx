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
            className={`${className} ${isActive ? 'font-bold' : 'font-normal'} text-lg`}
            href={isActive ? '' : href}
            passHref
            {...props}
        >
            {children}
        </Link>
    );
};

export default MyLink;
