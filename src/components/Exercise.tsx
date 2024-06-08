import React from 'react';
import Router from 'next/router';
import Image from 'next/image';
import { type RouterOutputs } from '~/utils/api';
import { truncateString } from '~/utils';
import { cn } from '~/lib/utils';
import { defaultFormatDateTime } from '~/utils/dates';

export const Exercise: React.FC<{
    exercise: RouterOutputs['exercise']['list']['values'][number];
    onClick?: React.MouseEventHandler<HTMLElement>;
    variant?: 'exercise' | 'landing' | 'chat';
}> = ({ exercise, onClick, variant }) => {
    const authorName = exercise.author
        ? exercise.author.name
        : 'Unknown author';
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
                          await Router.push(`/exercises/${exercise.id}`);
                      }
            }
        >
            {exercise.image && (
                <Image
                    src={exercise.image}
                    width={1920}
                    height={1080}
                    alt={truncateString(exercise.title)}
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
                    variant === 'exercise' && 'w-full',
                    variant === 'chat' && 'w-full p-6',
                    variant === 'landing' &&
                        'items-center md:w-3/5 md:items-start 2xl:w-full 2xl:items-center',
                )}
            >
                <div
                    className={cn(
                        variant === 'exercise' &&
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
                            variant === 'exercise' && 'md:text-xl 2xl:text-3xl',
                            variant === 'landing' && 'md:pb-4 2xl:py-4',
                            variant === 'chat' && 'text-xl',
                        )}
                    >
                        {truncateString(exercise.title)}
                    </p>
                </div>
                <div className="flex justify-between">
                    <small
                        className={cn(
                            'text-xs font-light',
                            variant === 'exercise' && 'self-start px-8 pb-8',
                            variant === 'landing' && 'md:self-end 2xl:mt-4',
                        )}
                    >
                        {authorName}
                    </small>
                    <small
                        className={cn(
                            'text-xs font-light',
                            variant === 'exercise' && 'self-start px-8 pb-8',
                            variant === 'landing' && 'md:self-end 2xl:mt-4',
                        )}
                    >
                        {defaultFormatDateTime(exercise.createdAt)}
                    </small>
                </div>
            </div>
        </article>
    );
};
