import React from 'react';
import Post from '../components/Post';
import { api } from '~/utils/api';
import { truculenta } from '~/pages/_app';
import Header from '~/components/Header';
import Image from 'next/image';

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
            <article className="flex w-full flex-col justify-center gap-8 py-16 shadow-inner md:px-80 2xl:flex-row 2xl:gap-32 2xl:px-40">
                {posts.data &&
                    posts.data.map((post) => (
                        <div
                            key={post.id}
                            className="flex-1 justify-center bg-blue-200 transition-shadow duration-100 ease-in hover:cursor-pointer hover:shadow md:rounded 2xl:min-w-72 2xl:max-w-80"
                        >
                            <Post post={post} />
                        </div>
                    ))}
            </article>
            <div className="flex items-center bg-neutral-200 bg-article-cover py-12 text-center drop-shadow-md md:h-auto md:justify-center md:p-32">
                <article className="flex flex-col gap-8 bg-neutral-300 bg-opacity-40 p-10 md:w-1/2 md:rounded-xl">
                    <h1 className="text-xl font-bold text-stone-800 md:text-4xl">
                        Чим ми надихались
                    </h1>
                    <p className="flex-grow font-medium text-stone-800 md:text-xl">
                        Maecenas tristique sagittis quam sit amet scelerisque.
                        Sed vel fermentum felis, quis tristique ex. Pellentesque
                        at velit efficitur, faucibus odio eget, pretium nisl.
                        Duis ut viverra purus. Proin lectus purus, congue eu
                        feugiat ut, cursus a ex. Vivamus mattis turpis sed ipsum
                        tincidunt, non finibus lectus hendrerit. In sit amet
                        quam mi. Sed ullamcorper ipsum magna. Sed efficitur,
                        tortor eu rutrum fermentum, ipsum eros tristique dui,
                        non blandit velit dui in nisi. Etiam quam nisl, mattis
                        ac justo sit amet, luctus suscipit purus.
                    </p>
                </article>
            </div>
            <article className="flex justify-center p-10 md:p-36">
                <div className="flex flex-col gap-8 md:gap-16">
                    <p
                        className={`${truculenta.className} text-center text-3xl text-cyan-800 md:text-5xl`}
                    >
                        Як ми можемо допомогти
                    </p>
                    <div className="flex flex-col gap-8 md:flex-row md:gap-0">
                        <div className="article-responsive">
                            <article>Професійні психологи</article>
                            <article>Чат 24/7</article>
                        </div>
                        <div className="flex items-center justify-center md:basis-1/3">
                            <Image
                                src="images/question-mark-svgrepo-com.svg"
                                alt="question mark"
                                height={400}
                                width={400}
                                className="h-52 w-52 md:h-auto md:w-auto"
                            ></Image>
                        </div>
                        <div className="article-responsive text-center md:text-right">
                            <article>Чат-боти у соціальних мережах</article>
                            <article>Статті від спеціалістів</article>
                        </div>
                    </div>
                </div>
            </article>
        </main>
    );
};

export default Blog;
