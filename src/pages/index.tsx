import React from 'react';
import Post from '../components/Post';
import { api } from '~/utils/api';
import { truculenta } from '~/pages/_app';
import Header from '~/components/Header';

const Blog: React.FC = () => {
    const posts = api.post.get.useQuery({
        limit: 4,
    });
    return (
        <main className="flex w-full flex-col">
            <div className="h-svh bg-homepage-cover bg-cover">
                <div className="flex h-full flex-col bg-neutral-200 bg-opacity-75">
                    <Header />
                    <section className="flex h-full flex-col">
                        <h1
                            className={`${truculenta.className} flex flex-grow items-center justify-center text-3xl text-cyan-800 md:text-6xl`}
                        >
                            Soulful
                        </h1>
                        <p className="w-3/4 flex-grow self-center text-center text-lg font-medium md:w-1/2 md:text-3xl">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Praesent ornare tortor ac elementum ultricies.
                            Donec sit amet tempor est, at placerat tellus.
                            Vestibulum ut risus placerat, vehicula velit eget,
                            aliquet elit. Phasellus vel sodales libero.
                            Suspendisse a vestibulum lorem. Suspendisse libero
                            quam, suscipit sit amet metus pulvinar, placerat
                            lacinia eros.
                        </p>
                    </section>
                </div>
            </div>
            <article className="flex w-full flex-col justify-center gap-8 py-16 shadow-inner md:px-60 2xl:flex-row 2xl:flex-wrap 2xl:gap-32 2xl:px-40">
                {posts.data &&
                    posts.data.map((post) => (
                        <article
                            key={post.id}
                            className="flex-1 justify-center bg-blue-200 transition-shadow duration-100 ease-in hover:cursor-pointer hover:shadow md:rounded 2xl:min-w-72 2xl:max-w-80"
                        >
                            <Post post={post} />
                        </article>
                    ))}
            </article>
        </main>
    );
};

export default Blog;
