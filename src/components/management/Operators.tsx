import type React from 'react';
import { UsersView } from '~/components/management/UsersView';
import { api } from '~/utils/api';
import { DEFAULT_LIMIT } from '~/utils/constants';
import { useRouter } from 'next/router';

export const Operators: React.FC = () => {
    const router = useRouter();

    const limit = router.query.limit
        ? Number(router.query.limit)
        : DEFAULT_LIMIT;
    const page = router.query.page ? Number(router.query.page) : 1;

    const users = api.user.list.useQuery({
        limit,
        page,
        permissions: ['chat:*'],
    });

    const total = users.data?.count ? Math.ceil(users.data.count / limit) : 0;

    return (
        <UsersView {...{ usersQuery: users, page, total, router }}></UsersView>
    );
};
