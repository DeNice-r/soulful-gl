import React from 'react';
import { ManagementPageName } from '~/utils/types';
import { Sidebar } from '~/components/management/Sidebar';
import { ShortHeader } from '~/components/management/ShortHeader';
import { Operators } from '~/components/management/Operators';
import { Toaster } from '~/components/ui/toaster';
import { Users } from '~/components/management/Users';

const pages = {
    [ManagementPageName.STATISTICS]: `<StatisticsComponent />`,
    [ManagementPageName.USERS]: <Users />,
    [ManagementPageName.OPERATORS]: <Operators />,
    [ManagementPageName.POSTS]: `<PostsComponent />`,
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
        <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="flex flex-col">
                <ShortHeader {...{ entity }} />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-6">
                    {entity in pages ? pages[entity] : 'Page not found'}
                </main>
            </div>
            <Toaster />
        </div>
    );
};
