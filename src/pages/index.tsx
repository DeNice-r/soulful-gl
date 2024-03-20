import React from 'react';
import { type GetStaticProps } from 'next';
import Post, { type PostProps } from '../components/Post';
import ConstrainedLayout from '../components/ConstrainedLayout';
import { db } from '~/server/db';

export const getStaticProps: GetStaticProps = async () => {
    const feed = await db.post.findMany({
        where: { published: true },
        include: {
            author: {
                select: { name: true },
            },
        },
    });
    return {
        props: { feed },
        revalidate: 10,
    };
};

type Props = {
    feed: PostProps[];
};

const Blog: React.FC<Props> = (props) => {
    return (
        <ConstrainedLayout>
            <div className="page">
                <h1>Public Feed</h1>
                <main className="flex flex-col ">
                    {props.feed.map((post) => (
                        <div
                            key={post.id}
                            className="w-full bg-slate-50 transition-shadow duration-100 ease-in hover:shadow"
                        >
                            <Post post={post} />
                        </div>
                    ))}
                </main>
            </div>
        </ConstrainedLayout>
    );
};

export default Blog;
