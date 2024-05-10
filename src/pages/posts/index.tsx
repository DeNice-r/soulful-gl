import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { CustomPagination } from '~/components/CustomPagination';
import { Post } from '~/components/Post';
import { Layout } from '~/components/common/Layout';
import { Spinner } from '~/components/ui/spinner';
import { api } from '~/utils/api';
import { DEFAULT_POSTS_LAYOUT_LIMIT } from '~/utils/constants';

const Posts: React.FC = () => {
    const [_, setState] = useState(0);

    const router = useRouter();

    const limit = router.query.limit
        ? Number(router.query.limit)
        : DEFAULT_POSTS_LAYOUT_LIMIT;

    const page = router.query.page ? Number(router.query.page) : 1;

    const posts = api.post.list.useQuery({ limit, page });

    const total = posts.data?.count ? Math.ceil(posts.data.count / limit) : 0;

    function rerender() {
        setState((prev) => prev + 1);
    }

    const goToPage = (page: number) => {
        const currentPath = router.pathname;
        const currentQuery = { ...router.query, page };
        void router.push({
            pathname: currentPath,
            query: currentQuery,
        });
    };

    useEffect(() => {
        if (posts.data) rerender();
    }, [posts.data]);

    return (
        <Layout className="bg-homepage-cover">
            <div className="flex w-2/3 flex-col items-center pb-8">
                <div className="flex w-full flex-wrap justify-between gap-8 p-12">
                    <h3 className="w-full pb-4 text-center font-bold text-slate-800">
                        Дописи з порадами щодо ментального здоров&apos;я
                    </h3>
                    {posts?.data?.values.map((post) => (
                        <div
                            key={post.id}
                            className="flex w-full flex-grow justify-center bg-neutral-300 shadow-md outline-2 outline-neutral-300 transition-shadow duration-100 ease-in hover:cursor-pointer hover:shadow-xl hover:outline md:rounded-md xl:w-5/12"
                        >
                            <Post variant="posts" post={post} />
                        </div>
                    ))}
                    {!posts.data && (
                        <div className="h-full w-full">
                            <Spinner size="large" />
                        </div>
                    )}
                </div>
                <CustomPagination
                    page={page}
                    total={total}
                    goToPage={goToPage}
                />
            </div>
        </Layout>
    );
};

export default Posts;
