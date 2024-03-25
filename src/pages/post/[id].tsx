import React from 'react';
import { type GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import { type PostProps } from '~/components/Post';
import { useSession } from 'next-auth/react';
import ConstrainedLayout from '~/components/ConstrainedLayout';
import { db } from '~/server/db';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const post = await db.post.findUnique({
        where: {
            id: String(params?.id),
        },
        include: {
            author: {
                select: { name: true, email: true },
            },
        },
    });

    if (!post) {
        return {
            notFound: true,
        };
    }
    return {
        props: post,
    };
};

async function publishPost(id: string): Promise<void> {
    await fetch(`/api/publish/${id}`, {
        method: 'PUT',
    });
    await Router.push('/');
}

async function deletePost(id: string): Promise<void> {
    await fetch(`/api/post/${id}`, {
        method: 'DELETE',
    });
    await Router.push('/');
}

const Post: React.FC<PostProps> = (props) => {
    const { data: session, status } = useSession();
    if (status === 'loading') {
        return <div>Authenticating ...</div>;
    }
    const userHasValidSession = Boolean(session);
    const postBelongsToUser = session?.user?.email === props.author?.email;
    let title = props.title;
    if (!props.published) {
        title = `${title} (Draft)`;
    }

    return (
        <ConstrainedLayout>
            <div>
                <h2>{title}</h2>
                <p>By {props?.author?.name || 'Unknown author'}</p>
                <ReactMarkdown>{props.description}</ReactMarkdown>
                {!props.published &&
                    userHasValidSession &&
                    postBelongsToUser && (
                        <button onClick={() => publishPost(props.id)}>
                            Publish
                        </button>
                    )}
                {userHasValidSession && postBelongsToUser && (
                    <button onClick={() => deletePost(props.id)}>Delete</button>
                )}
            </div>
        </ConstrainedLayout>
    );
};

export default Post;
