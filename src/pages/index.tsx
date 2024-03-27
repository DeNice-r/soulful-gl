import React from 'react';
import Post from '../components/Post';
import { api } from '~/utils/api';
import { truculenta } from '~/pages/_app';
import Header from '~/components/Header';

const Blog: React.FC = () => {
    const posts = api.post.get.useQuery();
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
                <div className="flex flex-col justify-between gap-16 px-40 py-16 shadow-inner md:flex-row md:flex-wrap">
                    {posts.data &&
                        posts.data.map((post) => (
                            <div
                                key={post.id}
                                className="min-w-72 max-w-80 flex-1 justify-center rounded bg-blue-200 transition-shadow duration-100 ease-in hover:cursor-pointer hover:shadow"
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
