import React from 'react';
import { Post } from '~/components/Post';
import { Layout } from '~/components/common/Layout';
import { api } from '~/utils/api';

const Posts: React.FC = () => {
    const posts = api.post.list.useQuery();
    return (
        <Layout className="bg-homepage-cover">
            <div className="flex w-2/3 flex-wrap justify-between gap-8 py-12">
                <h3 className="w-full pb-4 text-center font-bold text-slate-800">
                    Дописи з порадами щодо ментального здоров&apos;я
                </h3>
                {posts?.data?.values.map((post) => (
                    <div
                        key={post.id}
                        className="flex w-full flex-grow justify-center bg-neutral-300 shadow-md outline-2 outline-neutral-300 transition-shadow duration-100 ease-in hover:cursor-pointer hover:shadow-xl hover:outline md:w-5/12 md:rounded-md"
                    >
                        <Post variant="posts" post={post} />
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default Posts;
