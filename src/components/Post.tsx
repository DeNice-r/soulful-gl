import React from 'react';
import Router from 'next/router';
import ReactMarkdown from 'react-markdown';

export type PostProps = {
    id: string;
    title: string;
    author: {
        name: string;
        email: string;
    } | null;
    content: string;
    published: boolean;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
    const authorName = post.author ? post.author.name : 'Unknown author';
    return (
        <div
            className="p-8 text-inherit"
            onClick={() => Router.push('/post/[id]', `/post/${post.id}`)}
        >
            <p className="text-xl">{post.title}</p>
            <small>By {authorName}</small>
            <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
    );
};

export default Post;
