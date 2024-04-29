import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '~/components/Layout';
import Image from 'next/image';
import { api } from '~/utils/api';

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
            await router.push('/');
        }
    };

    const handlePublish = async (id: string) => {
        await updateMutation.mutateAsync({ id, published: true });
        router.reload();
    };

    return (
        <Layout>
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
                {!post.published && (
                    // isAtLeast(session?.user.role, UserRole.OPERATOR) &&
                    // todo: new permission system
                    <button onClick={() => handlePublish(post.id)}>
                        Publish
                    </button>
                )}
                {userHasValidSession && (
                    // isAtLeast(session?.user.role, UserRole.OPERATOR) &&
                    // todo: new permission system
                    <button onClick={() => handleDelete(post.id)}>
                        Delete
                    </button>
                )}
            </div>
        </Layout>
    );
};

export default Post;
