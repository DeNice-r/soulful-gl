import React from 'react';
import Router from 'next/router';
import Image from 'next/image';
import { type RouterOutputs } from '~/utils/api';
import { truncateString } from '~/utils';
import { cn } from '~/lib/utils';
import { defaultFormatDateTime } from '~/utils/dates';

export const Post: React.FC<{
    post: RouterOutputs['post']['list']['values'][number];
    onClick?: React.MouseEventHandler<HTMLElement>;
    variant?: 'posts' | 'landing' | 'chat';
}> = ({ post, onClick, variant }) => {
    const authorName = post.author ? post.author.name : 'Unknown author';
    return (
        <article
            className={cn(
                'flex h-full flex-col items-center gap-4 text-center text-inherit text-slate-800 md:gap-8 md:text-left  2xl:gap-0 2xl:text-center',
                variant === 'landing' && 'p-6 md:flex-row 2xl:flex-col',
            )}
            onClick={
                onClick
                    ? onClick
                    : async () => {
                          await Router.push(`/posts/${post.id}`);
                      }
            }
        >
            {post.image && (
                <Image
                    src={post.image}
                    width={1920}
                    height={1080}
                    alt={truncateString(post.title)}
                    className={cn(
                        'rounded-t-md object-contain',
                        variant === 'landing' &&
                            'w-2/3 rounded md:w-1/3 md:self-start 2xl:w-full 2xl:self-auto',
                    )}
                ></Image>
            )}
            <div
                className={cn(
                    'flex h-full flex-col justify-between gap-2 md:gap-8 2xl:gap-0 ',
                    variant === 'posts' && 'w-full',
                    variant === 'chat' && 'w-full p-6',
                    variant === 'landing' &&
                        'items-center md:w-3/5 md:items-start 2xl:w-full 2xl:items-center',
                )}
            >
                <div
                    className={cn(
                        variant === 'posts' &&
                            'flex w-full flex-col gap-6 p-8 text-justify',
                        variant === 'chat' &&
                            'flex w-full flex-col gap-4 text-justify',
                        variant === 'landing' &&
                            'divide-stone-700 md:w-4/5 md:divide-y 2xl:w-full',
                    )}
                >
                    <p
                        className={cn(
                            'font-bold',
                            variant === 'posts' && 'md:text-xl 2xl:text-3xl',
                            variant === 'landing' && 'md:pb-4 2xl:py-4',
                            variant === 'chat' && 'text-xl',
                        )}
                    >
                        {truncateString(post.title)}
                    </p>
                    {/*<div*/}
                    {/*    className={cn(*/}
                    {/*        'text-sm md:text-base',*/}
                    {/*        variant === 'landing' && 'py-2 md:py-4',*/}
                    {/*    )}*/}
                    {/*    dangerouslySetInnerHTML={{*/}
                    {/*        __html: truncateString(*/}
                    {/*            post.description,*/}
                    {/*            variant === 'posts'*/}
                    {/*                ? MAX_POSTS_DESCRIPTION_LENGTH*/}
                    {/*                : MAX_LANDING_POSTS_DESCRIPTION_LENGTH,*/}
                    {/*        ),*/}
                    {/*    }}*/}
                    {/*/>*/}
                </div>
                <div
                    className={cn(
                        'flex justify-between',
                        variant === 'landing' && 'w-full',
                    )}
                >
                    <small
                        className={cn(
                            'text-xs font-light',
                            variant === 'posts' && 'self-start px-8 pb-8',
                            variant === 'landing' && 'md:self-end 2xl:mt-4',
                        )}
                    >
                        {authorName}
                    </small>
                    <small
                        className={cn(
                            'text-xs font-light',
                            variant === 'posts' && 'self-start px-8 pb-8',
                            variant === 'landing' && 'md:self-end 2xl:mt-4',
                        )}
                    >
                        {defaultFormatDateTime(post.createdAt)}
                        {/*{post.createdAt != post.updatedAt &&*/}
                        {/*    ` (оновлено ${defaultFormatDt(post.updatedAt)})`}*/}
                    </small>
                </div>
            </div>
        </article>
    );
};
