import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import ConstrainedLayout from '~/components/ConstrainedLayout';
import Image from 'next/image';
import { api } from '~/utils/api';
import { isAtLeast } from '~/utils/frontend/auth';
import { UserRole } from '~/utils/types';

const Post: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const deleteMutation = api.post.delete.useMutation();
    const updateMutation = api.post.update.useMutation();

    const id = router.query.id;
    const query = api.post.getById.useQuery(id as string);
    const post = query.data;

    const userHasValidSession = Boolean(session);

    if (status === 'loading' || !post) {
        return <div>Loading...</div>;
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            await deleteMutation.mutateAsync(id);
            router.push('/');
        }
    };

    return (
        <ConstrainedLayout>
            <div>
                <h2>{post.title}</h2>
                <p>By {post?.author?.name || 'Unknown author'}</p>
                {post.image && (
                    <Image
                        src={post.image}
                        alt={`Image for ${post.title}`}
                        width={200}
                        height={200}
                    />
                )}
                <ReactMarkdown>{post.description}</ReactMarkdown>
                {!post.published &&
                    isAtLeast(session?.user.role, UserRole.OPERATOR) && (
                        <button
                            onClick={() =>
                                updateMutation.mutate({
                                    id: post.id,
                                    published: true,
                                })
                            }
                        >
                            Publish
                        </button>
                    )}
                {userHasValidSession &&
                    isAtLeast(session?.user.role, UserRole.OPERATOR) && (
                        <button onClick={() => handleDelete(post.id)}>
                            Delete
                        </button>
                    )}
            </div>
            <style jsx>{`
                .page {
                    background: var(--geist-background);
                    padding: 2rem;
                }

                .actions {
                    margin-top: 2rem;
                }

                button {
                    background: #ececec;
                    border: 0;
                    border-radius: 0.125rem;
                    padding: 1rem 2rem;
                }

                button + button {
                    margin-left: 1rem;
                }
            `}</style>
        </ConstrainedLayout>
    );
};

export default Post;
