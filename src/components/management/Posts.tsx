import React, { useState } from 'react';
import { api } from '~/utils/api';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table';
import { TableCell } from '@mui/material';
import { Spinner } from '~/components/ui/spinner';
import { User } from '~/components/management/User';
import { CustomPagination } from '~/components/CustomPagination';
import { useRouter } from 'next/router';
import { DEFAULT_LIMIT } from '~/utils/constants';
import { Post } from '~/components/management/Post';

export const Posts: React.FC = () => {
    const router = useRouter();
    const [_, setState] = useState(0);

    const limit = router.query.limit
        ? Number(router.query.limit)
        : DEFAULT_LIMIT;
    const page = router.query.page ? Number(router.query.page) : 1;

    const posts = api.post.list.useQuery({ limit, page });

    const total = posts.data?.count ? Math.ceil(posts.data?.count / limit) : 0;

    const editPost = async (arg: string) => {
        // setEditableUser(await apiClient.user.getById.query(arg));
        // changeModalState();
    };

    function editUser() {
        // setEditableUser(null);
        // changeModalState();
    }

    function rerender() {
        setState((prev) => prev + 1);
    }

    async function refetch() {
        await posts.refetch();
    }

    const goToPage = (page: number) => {
        const currentPath = router.pathname;
        const currentQuery = { ...router.query, page };
        void router.push({
            pathname: currentPath,
            query: currentQuery,
        });
    };

    return (
        <div className="rounded-lg border bg-neutral-300 p-2 shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-neutral-300">
                        <TableHead className="min-w-[150px]">
                            Ідентифікатор
                        </TableHead>
                        <TableHead className="min-w-[150px]">
                            Електронна пошта
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                            Дата створення
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                            Дата оновлення
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                            Статус
                        </TableHead>
                        <TableHead className="pr-6 text-right">Дії</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {posts.data?.values &&
                        posts.data.values.map((post) => (
                            <TableRow
                                key={post.id}
                                className="hover:bg-neutral-100/30"
                            >
                                <Post
                                    editPost={editPost}
                                    post={post}
                                    refetch={refetch}
                                />
                            </TableRow>
                        ))}
                    <CustomPagination
                        page={page}
                        total={total}
                        goToPage={goToPage}
                    />
                    {!posts.data && (
                        <TableRow>
                            <TableCell colSpan={100}>
                                <Spinner size="large" />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
