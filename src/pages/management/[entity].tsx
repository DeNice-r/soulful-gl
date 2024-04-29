import React from 'react';
import { useRouter } from 'next/router';
import { ManagementPageName } from '~/utils/types';
import { Layout } from '~/components/management/Layout';

const Management: React.FC = () => {
    const router = useRouter();

    const entity = router.query.entity as ManagementPageName;

    return (
        <Layout
            {...(Object.values(ManagementPageName).includes(entity) && {
                entity,
            })}
        />
    );
};

export default Management;
