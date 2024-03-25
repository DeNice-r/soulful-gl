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
        <div
            className="flex flex-col items-center p-8 text-inherit"
            onClick={() => Router.push('/post/[id]', `/post/${post.id}`)}
        >
            <p className="text-xl">{post.title}</p>
            {post.image && (
                <Image
                    src={post.image}
                    width={500}
                    height={500}
                    alt={post.title}
                ></Image>
            )}
            <small>By {authorName}</small>
            <ReactMarkdown>{post.description}</ReactMarkdown>
        </div>
    );
};

export default Post;
