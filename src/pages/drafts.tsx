import React from 'react';
import { useSession } from 'next-auth/react';
import Layout from '~/components/Layout';
import Post from '../components/Post';
import { api } from '~/utils/api';

const Drafts: React.FC = () => {
    const { data: session } = useSession();
    const postQuery = api.post.getUnpublished.useQuery();
    const drafts = postQuery.data;

    if (
        !session
        // || !isAtLeast(session.user.role, UserRole.OPERATOR)
    ) {
        return (
            <Layout>
                <div>You are unauthorized to view this page.</div>
            </Layout>
        );
    }

    if (!drafts) {
        return (
            <Layout>
                <div>No drafts found so far...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center p-3">
                <h1>My Drafts</h1>
                <div className="flex flex-col gap-2">
                    {drafts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-slate-100 transition hover:shadow"
                        >
                            <Post post={post} />
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Drafts;
