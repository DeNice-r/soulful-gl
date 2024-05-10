import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Layout } from '~/components/common/Layout';
import Image from 'next/image';
import { api } from '~/utils/api';
import { Button } from '~/components/ui/button';
import { defaultFormatDt } from '~/utils/dates';

const Post: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const deleteMutation = api.post.delete.useMutation();
    const updateMutation = api.post.update.useMutation();

    const id = router.query.id;
    const query = api.post.get.useQuery(id as string);
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
            <div className="flex w-2/3 flex-col gap-6 py-10">
                <div>
                    <div className="flex justify-between">
                        <h3 className="pb-6 text-justify font-bold">
                            {post.title}
                        </h3>
                        <div className="flex h-full gap-4">
                            {/* isAtLeast(session?.user.role, UserRole.OPERATOR) &&
                        todo: new permission system */}
                            <Button
                                className="px-8 hover:bg-neutral-300"
                                variant={'ghost'}
                                onClick={() => handlePublish(post.id)}
                            >
                                {!post.published ? 'Опублікувати' : 'Приховати'}
                            </Button>
                            {userHasValidSession && (
                                // isAtLeast(session?.user.role, UserRole.OPERATOR) &&
                                // todo: new permission system
                                <Button
                                    className="px-8"
                                    onClick={() => handleDelete(post.id)}
                                >
                                    Видалити
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between text-sm text-neutral-500">
                        <p className="pb-4">
                            By {post?.author?.name || 'Unknown author'}
                        </p>
                        <p>{defaultFormatDt(post.createdAt)}</p>
                    </div>
                    {post.image && (
                        <Image
                            className="aspect-video"
                            src={post.image}
                            alt={`Image for ${post.title}`}
                            width={1920}
                            height={1080}
                        />
                    )}
                </div>
                <div
                    className="text-justify"
                    dangerouslySetInnerHTML={{ __html: post.description }}
                />
            </div>
        </Layout>
    );
};

export default Post;
