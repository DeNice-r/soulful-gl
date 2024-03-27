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
            className="flex h-full flex-col items-center justify-between p-8 text-center text-inherit text-slate-800"
            onClick={() => Router.push('/post/[id]', `/post/${post.id}`)}
        >
            <div className="flex flex-col items-center">
                {post.image && (
                    <Image
                        src={post.image}
                        width={500}
                        height={500}
                        alt={post.title}
                        className="w-11/12 rounded"
                    ></Image>
                )}
                <div className="divide-y divide-stone-700">
                    <p className="py-4 text-3xl font-bold">{post.title}</p>
                    <ReactMarkdown className={'py-4'}>
                        {post.description}
                    </ReactMarkdown>
                </div>
            </div>
            <div className="self-end rounded bg-stone-700 px-2 py-1 md:mt-4">
                <small className="font-light text-neutral-200">
                    {authorName}
                </small>
            </div>
        </article>
    );
};

export default Post;
