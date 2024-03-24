import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MyLink = ({
    href,
    children,
    ...props
}: {
    href: string;
    children: any;
    props?: never;
}) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link href={isActive ? '' : href} passHref {...props}>
            <button className={isActive ? 'btn-active' : 'btn-primary'}>
                {children}
            </button>
        </Link>
    );
};

export default MyLink;
