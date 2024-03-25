import React from 'react';
import { useSession } from 'next-auth/react';
import Layout from '~/components/Layout';
import Post from '../components/Post';
import ConstrainedLayout from '../components/ConstrainedLayout';
import { UserRole } from '~/utils/types';
import { isAtLeast } from '~/utils/authAssertions';
import { api } from '~/utils/api';

const Drafts: React.FC = () => {
    const { data: session } = useSession();
    const postQuery = api.post.getOwnUnpublished.useQuery();
    const drafts = postQuery.data;

    if (!session || !isAtLeast(session.user.role, UserRole.OPERATOR)) {
        return (
            <Layout>
                <div>You are unauthorized to view this page.</div>
            </Layout>
        );
    }

    if (!drafts) {
        return (
            <ConstrainedLayout>
                <div>No drafts found so far...</div>
            </ConstrainedLayout>
        );
    }

    return (
        <ConstrainedLayout>
            <div className="page">
                <h1>My Drafts</h1>
                <main>
                    {drafts.map((post) => (
                        <div key={post.id} className="post">
                            <Post post={post} />
                        </div>
                    ))}
                </main>
            </div>
            <style jsx>{`
                .post {
                    transition: box-shadow 0.1s ease-in;
                }

                .post:hover {
                    box-shadow: 1px 1px 3px #aaa;
                }

                .post + .post {
                    margin-top: 2rem;
                }
            `}</style>
        </ConstrainedLayout>
    );
};

export default Drafts;
