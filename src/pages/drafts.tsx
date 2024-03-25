import React from 'react';
import { type GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Layout from '~/components/Layout';
import Post, { type PostProps } from '../components/Post';
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
        <Layout>
            <div className="flex flex-col items-center justify-center p-3">
                <h1>My Drafts</h1>
                <div className="flex flex-col gap-2">
                    {props.drafts.map((post) => (
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
