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

    const noDate = feed.map((post) => {
        return {
            ...post,
            createdAt: post.createdAt.toString(),
            updatedAt: post.updatedAt.toString(),
        };
    });

    return {
        props: {
            feed: noDate,
        },
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
                <main>
                    {props.feed.map((post) => (
                        <div key={post.id} className="post">
                            <Post post={post} />
                        </div>
                    ))}
                </main>
            </div>
            <style jsx>{`
                .post {
                    background: white;
                    transition: box-shadow 0.1s ease-in;
                }

                .post:hover {
                    box-shadow: 1px 1px 3px #aaa;
                }

                .post + .post {
                    margin-top: 2rem;
                }
            `}</style>
        </ConstrainedLayout>
    );
};

export default Blog;
