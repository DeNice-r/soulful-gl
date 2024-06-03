import React from 'react';
import Link from 'next/link';
import { type ManagementPageName, PageTitleMap } from '~/utils/types';
import ProfilePopup from '~/components/common/ProfilePopup';

export const ShortHeader: React.FC<{ entity?: ManagementPageName }> = ({
    entity,
}) => {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
            <Link className="lg:hidden" href="/public">
                <span className="sr-only">Головна</span>
            </Link>
            <div className="w-full">
                <h1 className="text-lg font-semibold">
                    {entity ? PageTitleMap[entity] : 'Керування'}
                </h1>
            </div>
            <ProfilePopup />
        </header>
    );
};
