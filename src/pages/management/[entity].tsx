import React from 'react';
import { useRouter } from 'next/router';
import ManagementLayout from '~/components/ManagementLayout';
import { ManagementPageName } from '~/utils/types';

const Management: React.FC = () => {
    const router = useRouter();

    const entity = router.query.entity as ManagementPageName;

    if (!(entity in ManagementPageName)) return;
    return <ManagementLayout {...{ entity }} />;
};

export default Management;
