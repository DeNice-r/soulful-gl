import type React from 'react';
import { useState } from 'react';
import { UsersView } from '~/components/management/UsersView';
import { api } from '~/utils/api';
import { DEFAULT_LIMIT, NO_REFETCH } from '~/utils/constants';
import { useRouter } from 'next/router';

export const Users: React.FC = () => {
    const router = useRouter();
    const queryParam = router.query.query;
    const orderBy = router.query.orderBy as string | undefined;
    const order = router.query.order as string | undefined;

    const [query, setQuery] = useState<string | undefined>(
        queryParam as string,
    );

    const limit = router.query.limit
        ? Number(router.query.limit)
        : DEFAULT_LIMIT;
    const page = router.query.page ? Number(router.query.page) : 1;

    const users = api.user.list.useQuery(
        { limit, page, query, orderBy, order },
        NO_REFETCH,
    );

    const total = users.data?.count ? Math.ceil(users.data.count / limit) : 0;

    return (
        <UsersView
            {...{
                usersQuery: users,
                page,
                total,
                router,
                query,
                setQuery,
                orderBy,
                order,
            }}
        ></UsersView>
    );
};
