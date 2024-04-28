import React from 'react';
import Router from 'next/router';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { type RouterOutputs } from '~/utils/api';
import { truncateString } from '~/utils';
import { MAX_DESCRIPTION_LENGTH } from '~/utils/constants';

export const Post: React.FC<{ post: RouterOutputs['post']['get'][number] }> = ({
    post,
}) => {
    const authorName = post.author ? post.author.name : 'Unknown author';
    return (
        <article
            className="flex h-full flex-col items-center gap-4 p-6 text-center text-inherit text-slate-800 md:flex-row md:gap-8 md:text-left 2xl:flex-col 2xl:gap-0 2xl:text-center"
            onClick={() => Router.push('/post/[id]', `/post/${post.id}`)}
        >
            {post.image && (
                <Image
                    src={post.image}
                    width={1920}
                    height={1080}
                    alt={truncateString(post.title)}
                    className="w-2/3 rounded object-contain md:w-1/3 md:self-start 2xl:w-full 2xl:self-auto"
                ></Image>
            )}
            <div className="flex h-full flex-col items-center justify-between gap-2 md:w-3/5 md:items-start md:gap-8 2xl:w-full 2xl:flex-col 2xl:items-center 2xl:gap-0 ">
                <div className="divide-stone-700 md:w-4/5 md:divide-y 2xl:w-full">
                    <p className="font-bold md:pb-4 md:text-xl 2xl:py-4 2xl:text-3xl">
                        {truncateString(post.title)}
                    </p>
                    <ReactMarkdown
                        className={'py-2 text-sm md:py-4 md:text-base'}
                    >
                        {truncateString(
                            post.description,
                            MAX_DESCRIPTION_LENGTH,
                        )}
                    </ReactMarkdown>
                </div>
                <small className="text-xs font-light md:self-end 2xl:mt-4">
                    {authorName}
                </small>
            </div>
        </article>
    );
};
