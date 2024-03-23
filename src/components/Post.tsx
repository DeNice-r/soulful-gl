import React from 'react';
import Router from 'next/router';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

export type PostProps = {
    id: string;
    title: string;
    author: {
        name: string;
        email: string;
    } | null;
    content: string;
    image: string;
    published: boolean;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
    const authorName = post.author ? post.author.name : 'Unknown author';
    return (
        <div onClick={() => Router.push('/post/[id]', `/post/${post.id}`)}>
            <h2>{post.title}</h2>
            {post.image && (
                <Image
                    src={post.image}
                    width={500}
                    height={500}
                    alt={post.title}
                ></Image>
            )}
            <small>By {authorName}</small>
            <ReactMarkdown>post.content</ReactMarkdown>
            <style jsx>{`
                div {
                    color: inherit;
                    padding: 2rem;
                }
            `}</style>
        </div>
    );
};

export default Post;
