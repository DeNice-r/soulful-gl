import {NextApiHandler} from 'next';
import NextAuth from 'next-auth';
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import GitHub from 'next-auth/providers/github';
import prisma from '../../../lib/prisma';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);
export default authHandler;

export const authOptions = {
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
    callbacks: {
        session,
    },
};

function session({session, user})
{
    session.user.role = user.role
    return session
}
