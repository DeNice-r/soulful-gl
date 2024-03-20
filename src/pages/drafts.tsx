import React from 'react';
import { type GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Layout from '~/components/Layout';
import Post, { type PostProps } from '../components/Post';
import ConstrainedLayout from '../components/ConstrainedLayout';
import { UserRole } from '~/utils/types';
import { StatusCodes } from 'http-status-codes';
import { db } from '~/server/db';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req });
    if (!session) {
        res.statusCode = StatusCodes.UNAUTHORIZED;
        return { props: { drafts: [] } };
    }

    const drafts = await db.post.findMany({
        where: {
            author: { email: session.user.email },
            published: false,
        },
        include: {
            author: {
                select: { name: true },
            },
        },
    });
    return {
        props: { drafts },
    };
};

type Props = {
    drafts: PostProps[];
};

const Drafts: React.FC<Props> = (props) => {
    const { data: session } = useSession();

    if (!session || session.user.role < (UserRole.OPERATOR as number)) {
        return (
            <Layout>
                <div>You are unauthorized to view this page.</div>
            </Layout>
        );
    }

    return (
        <ConstrainedLayout>
            <div className="page">
                <h1>My Drafts</h1>
                <main>
                    {props.drafts.map((post) => (
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
