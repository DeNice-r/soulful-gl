import React from 'react';
import { ManagementPageName } from '~/utils/types';
import { Sidebar } from '~/components/management/common/Sidebar';
import { ShortHeader } from '~/components/management/common/ShortHeader';
import { Toaster } from '~/components/ui/toaster';

import { Statistics } from '~/components/management/Statistics';
import Users from '~/components/management/User';
import { Operators } from '~/components/management/User/Operators';
import Posts from '~/components/management/Post';
import Recommendations from '~/components/management/Recommendation';
import Exercises from '~/components/management/Exercise';
import QnA from '~/components/management/QnA';
import { PageProvider } from '../Exercise/PageProvider';

const pages = {
    [ManagementPageName.STATISTICS]: <Statistics />,
    [ManagementPageName.USERS]: <Users />,
    [ManagementPageName.OPERATORS]: <Operators />,
    [ManagementPageName.POSTS]: <Posts />,
    [ManagementPageName.RECOMMENDATIONS]: <Recommendations />,
    [ManagementPageName.EXERCISES]: <Exercises />,
    [ManagementPageName.KNOWLEDGE]: `<Knowledge />`,
    [ManagementPageName.ACHIEVEMENTS]: `<Achievements />`,
    [ManagementPageName.DONATIONS]: `<Donations />`,
    [ManagementPageName.QnA]: <QnA />,
};

export const Layout: React.FC<{ entity?: ManagementPageName }> = ({
    entity = ManagementPageName.STATISTICS,
}) => {
    return (
        <PageProvider>
            <div className="flex min-h-screen">
                <Sidebar {...{ entity }} />
                <div className="flex flex-grow flex-col">
                    <ShortHeader {...{ entity }} />
                    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-4 md:p-6">
                        {entity in pages ? pages[entity] : 'Page not found'}
                    </main>
                </div>
                <Toaster />
            </div>
        </PageProvider>
    );
};
