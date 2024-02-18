import React from 'react';
import Button from '@mui/material/Button';
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
            <Button variant={isActive ? 'text' : 'contained'}>
                {children}
            </Button>
        </Link>
    );
};

export default MyLink;
