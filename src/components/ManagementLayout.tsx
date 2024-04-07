import React from 'react';
import Sidebar from '~/components/Sidebar';
import ShortHeader from '~/components/ShortHeader';
import { ManagementPageNames } from '~/utils/types';
import Users from '~/pages/management/Users';
import Operators from '~/pages/management/Operators';

const ManagementLayout: React.FC<{ entity?: ManagementPageNames }> = ({
    entity,
}) => {
    let mainContent;
    switch (entity) {
        case ManagementPageNames.USERS:
            mainContent = <Users />;
            break;
        case ManagementPageNames.OPERATORS:
            mainContent = <Operators />;
            break;
        case ManagementPageNames.STATISTICS:
            mainContent = `<StatisticsComponent />`;
            break;
        default:
            mainContent = <div>Page not found</div>;
    }
    return (
        <div className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="flex flex-col">
                <ShortHeader {...{ entity }} />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                    <div className="rounded-lg border p-2 shadow-sm">
                        {mainContent}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ManagementLayout;
