import React from 'react';
import Logo from './Logo';
import Link from 'next/link';
import { Button } from './ui/button';

interface SidebarProps {
    changeTab: (tabName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ changeTab }) => {
    return (
        <div className="hidden border-r bg-gray-100/40 dark:bg-gray-800/40 lg:block">
            <div className="flex flex-col gap-2">
                <Logo className="hidden h-[60px] px-6 text-3xl" />
                <div className="flex-1">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <Button
                            asChild
                            variant="ghost"
                            className="justify-start p-0"
                        >
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                href="/"
                            >
                                <HomeIcon className="h-4 w-4" />
                                Головна
                            </Link>
                        </Button>
                        <Button
                            onClick={() => changeTab('users')}
                            variant="ghost"
                            className="flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                        >
                            <UsersIcon className="h-4 w-4" />
                            Користувачі
                        </Button>
                        <Button
                            onClick={() => changeTab('operators')}
                            variant="ghost"
                            className="flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                        >
                            <UsersIcon className="h-4 w-4" />
                            Оператори
                        </Button>
                        <Button
                            onClick={() => changeTab('statistics')}
                            variant="ghost"
                            className="flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                        >
                            <LineChartIcon className="h-4 w-4" />
                            Статистика
                        </Button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

function HomeIcon(
    props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    );
}

function LineChartIcon(
    props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
        </svg>
    );
}

function UsersIcon(
    props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

export default Sidebar;
