import React from 'react';
import { ManagementPageName } from '~/utils/types';
import { Sidebar } from '~/components/management/Sidebar';
import { ShortHeader } from '~/components/management/ShortHeader';
import { Operators } from '~/components/management/Operators';
import { Toaster } from '~/components/ui/toaster';
import { Users } from '~/components/management/Users';
import { Statistics } from '~/components/management/Statistics';
import { Posts } from '~/components/management/Posts';

const pages = {
    [ManagementPageName.STATISTICS]: <Statistics />,
    [ManagementPageName.USERS]: <Users />,
    [ManagementPageName.OPERATORS]: <Operators />,
    [ManagementPageName.POSTS]: <Posts />,
    [ManagementPageName.EXCERCISES]: `<Excercises />`,
    [ManagementPageName.KNOWLEDGE]: `<Knowledge />`,
    [ManagementPageName.ACHIEVEMENTS]: `<Achievements />`,
    [ManagementPageName.DONATIONS]: `<Donations />`,
    [ManagementPageName.QnA]: `<QnA />`,
};

export const Layout: React.FC<{ entity?: ManagementPageName }> = ({
    entity = ManagementPageName.STATISTICS,
}) => {
    return (
        <div className="flex min-h-screen overflow-hidden">
            <Sidebar {...{ entity }} />
            <div className="flex flex-grow flex-col">
                <ShortHeader {...{ entity }} />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-6">
                    {entity in pages ? pages[entity] : 'Page not found'}
                </main>
            </div>
            <Toaster />
        </div>
    );
};
