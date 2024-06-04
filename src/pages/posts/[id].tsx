import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Layout } from '~/components/common/Layout';
import Image from 'next/image';
import { api } from '~/utils/api';
import { Button } from '~/components/ui/button';
import { defaultFormatDateTime } from '~/utils/dates';
import { Spinner } from '~/components/ui/spinner';
import { hasAccess } from '~/utils/authAssertions';
import Head from 'next/head';

const PostId: React.FC = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const deleteMutation = api.post.delete.useMutation();
    const updateMutation = api.post.update.useMutation();

    const id = router.query.id;
    const query = api.post.get.useQuery(id as string);
    const post = query.data;

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            await deleteMutation.mutateAsync(id);
            await router.push('/');
        }
    };

    return (
        <Layout>
            <Head>
                <title>{post?.title}</title>
            </Head>
            {!post && <Spinner size="large" />}
            {post && (
                <div className="flex w-2/3 flex-col gap-6 py-10">
                    <div>
                        <div className="flex justify-between">
                            <h3 className="pb-6 text-justify font-bold">
                                {post.title}
                            </h3>

                            <div className="flex h-full gap-4">
                                {hasAccess(
                                    session?.user?.permissions ?? [],
                                    'post',
                                    'delete',
                                ) && (
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
                            <p>{defaultFormatDateTime(post.createdAt)}</p>
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
            )}
        </Layout>
    );
};

export default PostId;
