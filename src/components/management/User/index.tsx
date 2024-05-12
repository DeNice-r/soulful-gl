import type React from 'react';
import { useState } from 'react';
import { View } from '~/components/management/User/View';
import { api } from '~/utils/api';
import { DEFAULT_LIMIT, NO_REFETCH } from '~/utils/constants';
import { useRouter } from 'next/router';

const XTable: React.FC = () => {
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

    const entities = api.user.list.useQuery(
        { limit, page, query, orderBy, order },
        NO_REFETCH,
    );

    const total = entities.data?.count
        ? Math.ceil(entities.data.count / limit)
        : 0;

    return (
        <View
            {...{
                entities,
                page,
                total,
                router,
                query,
                setQuery,
                orderBy,
                order,
            }}
        ></View>
    );
};

export default XTable;
