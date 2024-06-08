import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { truculenta } from './_app';
import { Logo } from '~/components/common/Logo';
import { Post } from '~/components/Post';
import { api } from '~/utils/api';
import { Layout } from '~/components/common/Layout';
import {
    FacebookIcon,
    TelegramIcon,
    ViberIcon,
} from '~/components/common/Footer';

const Blog: React.FC = () => {
    const posts = api.post.list.useQuery({
        limit: 4,
    });
    return (
        <Layout className="flex-col bg-homepage-cover">
            <section className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center md:gap-16">
                <Logo className="flex text-3xl 2xl:text-6xl" />
                <p className="w-3/4 self-center text-center text-lg font-medium md:w-1/2 md:text-xl 2xl:text-3xl">
                    Ласкаво просимо до нашого волонтерського проєкту
                    психологічної підтримки. Ми - команда кваліфікованих
                    волонтерів, готових вас вислухати і допомогти знайти
                    рішення. Ми віримо в те, що кожен заслуговує на допомогу та
                    підтримку в складні моменти. Наша мета – надати безкоштовну,
                    анонімну та доступну психологічну допомогу через чат у
                    месенджерах. У складній життєвій ситуації будьте впевнені -
                    ми прагнемо вам допомогти.
                </p>
                <div className="flex justify-between gap-8">
                    <Link
                        className="flex h-14 w-14 items-center justify-center rounded-lg bg-neutral-200 shadow-sm transition-colors hover:bg-neutral-100 hover:shadow-md dark:bg-gray-800"
                        href="https://t.me/soulful_aid_bot"
                    >
                        <TelegramIcon className="h-10 w-10" />
                        <span className="sr-only">Twitter</span>
                    </Link>
                    <Link
                        className="flex h-14 w-14 items-center justify-center rounded-lg bg-neutral-200 shadow-sm transition-colors hover:bg-neutral-100 hover:shadow-md dark:bg-gray-800"
                        href="https://www.facebook.com/profile.php?id=100090500564311"
                    >
                        <FacebookIcon className="h-6 w-6" />
                        <span className="sr-only">Facebook</span>
                    </Link>

                    <Link
                        className="flex h-14 w-14 items-center justify-center rounded-lg bg-neutral-200 shadow-sm transition-colors hover:bg-neutral-100 hover:shadow-md dark:bg-gray-800"
                        href="https://www.viber.com/sinapitest"
                    >
                        <ViberIcon className="h-6 w-6" />
                        <span className="sr-only">Viber</span>
                    </Link>
                </div>
            </section>
            <article className="flex w-full flex-col justify-center gap-8 py-16 md:px-80 2xl:flex-row 2xl:gap-32 2xl:px-40">
                {posts?.data?.values.map((post) => (
                    <div
                        key={post.id}
                        className="flex-1 justify-center bg-neutral-300 bg-opacity-80 shadow-md outline outline-neutral-400 transition-shadow duration-100 ease-in hover:cursor-pointer hover:shadow-lg md:rounded-md"
                    >
                        <Post variant="landing" post={post} />
                    </div>
                ))}
            </article>
            <div className="flex items-center py-12 text-center md:h-auto md:justify-center md:p-32">
                <article className="flex flex-col gap-8 bg-neutral-300 bg-opacity-70 p-10 drop-shadow-lg md:w-1/2 md:rounded-xl">
                    <h1 className="text-xl font-bold text-stone-800 md:text-4xl">
                        Чим ми надихались
                    </h1>
                    <p className="flex-grow font-medium text-stone-800 md:text-xl">
                        Ми надихалися історіями людей, які знайшли сили подолати
                        труднощі завдяки підтримці близьких та професіоналів.
                        Усвідомлення важливості доступної психологічної допомоги
                        мотивувало нас створити цей проєкт. Ми віримо в силу
                        співчуття та емпатії, які можуть змінити життя. Досвід
                        волонтерів та успішні приклади підтримки в інших країнах
                        стали для нас джерелом натхнення. Ми прагнемо, щоб кожен
                        мав можливість отримати допомогу у складні моменти,
                        відчуваючи турботу та розуміння.
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
                                src="images/question-mark.svg"
                                alt="question mark"
                                height={400}
                                width={400}
                                className="h-52 w-52 md:h-auto md:w-auto"
                            ></Image>
                        </div>
                        <div className="article-responsive text-center md:text-right">
                            <article>Чат-боти у соціальних мережах</article>
                            <article>Статті та вправи від спеціалістів</article>
                        </div>
                    </div>
                </div>
            </article>
            <div className="flex justify-center px-8 md:justify-end">
                <Link
                    href="https://www.wordpress.com"
                    className="bg-slate-50 p-5 font-serif font-light text-slate-600 hover:text-slate-400 hover:underline"
                >
                    Proudly powered by WordPress 😎
                </Link>
            </div>
        </Layout>
    );
};

export default Blog;
