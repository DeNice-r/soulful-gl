import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Layout } from '~/components/management/Layout';
import { type ManagementPageName } from '~/utils/types';

const Management: React.FC = () => {
    const { update: updateSession, data: session, status } = useSession();

    const image = session?.user?.image ?? 'images/placeholder.svg';
    const name = session?.user?.name ?? 'Користувач';

    const router = useRouter();

    const entity = router.query.entity as ManagementPageName;

    if (typeof entity !== 'string') return;
    return <Layout {...{ entity }} />;
};

export default Management;
