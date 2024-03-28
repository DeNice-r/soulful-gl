import React from 'react';
import Router from 'next/router';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { type RouterOutputs } from '~/utils/api';

const Post: React.FC<{ post: RouterOutputs['post']['get'][number] }> = ({
    post,
}) => {
    const authorName = post.author ? post.author.name : 'Unknown author';
    return (
        <article
            className="flex h-full flex-col items-center justify-between p-8 text-center text-inherit text-slate-800 md:text-left 2xl:text-center"
            onClick={() => Router.push('/post/[id]', `/post/${post.id}`)}
        >
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-8 2xl:flex-col 2xl:items-center ">
                {post.image && (
                    <Image
                        src={post.image}
                        width={1920}
                        height={1080}
                        alt={post.title}
                        className="w-11/12 rounded object-contain md:w-1/3 2xl:w-11/12"
                    ></Image>
                )}
                <div className="divide-stone-700 md:w-2/3 md:divide-y">
                    <p className="text-lg font-bold md:pb-4 md:text-xl 2xl:text-3xl">
                        {post.title}
                    </p>
                    <ReactMarkdown className={'py-2 md:py-4'}>
                        {post.description}
                    </ReactMarkdown>
                </div>
            </div>
            <div className="self-end rounded bg-stone-700 px-1 md:px-2 md:py-1 2xl:mt-4">
                <small className="text-xs font-light text-neutral-200">
                    {authorName}
                </small>
            </div>
        </article>
    );
};

export default Post;
