import React from 'react';
import { useRouter } from 'next/router';
import { Layout } from '~/components/management/Layout';
import { ManagementPageName } from '~/utils/types';

const Management: React.FC = () => {
    const router = useRouter();

    const entity = router.query.entity as ManagementPageName;

    if (!(entity in ManagementPageName)) return;
    return <Layout {...{ entity }} />;
};

export default Management;
