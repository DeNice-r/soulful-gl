import React from 'react';
import { type GetStaticProps } from 'next';
import Post, { type PostProps } from '../components/Post';
import { db } from '~/server/db';
import { truculenta } from '~/pages/_app';
import Header from '~/components/Header';

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
        <div className="flex flex-col gap-4">
            <main className="flex flex-col">
                <div className="h-svh bg-homepage-cover bg-cover">
                    <div className="flex h-full flex-col bg-neutral-200 bg-opacity-75">
                        <Header />
                        <h1
                            className={`${truculenta.className} flex flex-grow items-center justify-center text-6xl text-cyan-800`}
                        >
                            Soulful
                        </h1>
                        <p className="w-1/2 flex-grow self-center text-3xl font-medium">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Praesent ornare tortor ac elementum ultricies.
                            Donec sit amet tempor est, at placerat tellus.
                            Vestibulum ut risus placerat, vehicula velit eget,
                            aliquet elit. Phasellus vel sodales libero.
                            Suspendisse a vestibulum lorem. Suspendisse libero
                            quam, suscipit sit amet metus pulvinar, placerat
                            lacinia eros.
                        </p>
                    </div>
                </div>
                <div className="flex gap-8 bg-neutral-200 p-8 shadow-inner">
                    {props.feed.map((post) => (
                        <div
                            key={post.id}
                            className="flex-1 justify-center bg-emerald-50 transition-shadow duration-100 ease-in hover:shadow"
                        >
                            <Post post={post} />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Blog;
