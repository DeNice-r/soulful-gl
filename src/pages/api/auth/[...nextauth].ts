import NextAuth, { type DefaultSession, type NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';
import CredentialProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import { db } from '~/server/db';
import { decode, encode } from 'next-auth/jwt';
import { type ExtendedChat } from '~/utils/types';
import bcrypt from 'bcrypt';
import type { Adapter } from 'next-auth/adapters';

// @ts-expect-error TS7016
import Cookies from 'cookies'; // todo: replace with a better library
import { env } from '~/env';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
            role: number;
            isOnline: boolean;
            permissions: string[];
        };
        personnel: {
            chats: Record<number, ExtendedChat>;
        };

        entity: string;
        action: string;
    }

    interface DefaultUser {
        id: string;
        role: number;
        isOnline: boolean;
    }
}

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const data = requestWrapper(req, res);
    return await NextAuth(...data);
};

export default handler;

export function requestWrapper(
    req: NextApiRequest,
    res: NextApiResponse,
): [req: NextApiRequest, res: NextApiResponse, opts: NextAuthOptions] {
    const generateSessionToken = () => randomUUID();

    const fromDate = (time: number, date = Date.now()) =>
        new Date(date + time * 1000);

    const adapter = PrismaAdapter(db) as Adapter;

    const opts: NextAuthOptions = {
        adapter,
        callbacks: {
            async session({ session, user }) {
                session.user.id = user.id;
                session.user.name = user.name ?? '';
                session.user.email = user.email;
                session.user.role = user.role;
                session.user.isOnline = user.isOnline;

                const u = await db.user.findUnique({
                    where: {
                        id: user.id,
                    },
                    select: {
                        permissions: {
                            select: {
                                title: true,
                            },
                        },
                    },
                });

                if (u?.permissions) {
                    session.user.permissions = u.permissions.map(
                        (permission) => permission.title,
                    ) as string[];
                }

                const chatList = await db.chat.findMany({
                    where: {
                        personnelId: user.id,
                    },
                });

                const chats: Record<number, ExtendedChat> = {};

                for (const chat of chatList) {
                    chats[chat.id] = {
                        ...chat,
                        messages: await db.message.findMany({
                            where: {
                                chatId: Number(chat.id),
                            },
                            orderBy: {
                                createdAt: 'asc',
                            },
                        }),
                    };
                }

                session.personnel = { chats };
                return session;
            },
            async signIn({ user, account, profile, email, credentials }) {
                if (
                    req.query.nextauth?.includes('callback') &&
                    req.query.nextauth?.includes('credentials') &&
                    req.method === 'POST'
                ) {
                    if (user) {
                        const sessionToken = generateSessionToken();
                        const sessionMaxAge = 60 * 60 * 24 * 30; //30Daysconst sessionMaxAge = 60 * 60 * 24 * 30; //30Days
                        const sessionExpiry = fromDate(sessionMaxAge);

                        if (!adapter || !adapter.createSession)
                            throw new Error('Adapter is not defined');

                        await adapter.createSession({
                            sessionToken: sessionToken,
                            userId: user.id,
                            expires: sessionExpiry,
                        });

                        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
                        const cookies = new Cookies(req, res);

                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
                        cookies.set('next-auth.session-token', sessionToken, {
                            expires: sessionExpiry,
                        });
                    }
                }

                return true;
            },
        },
        jwt: {
            encode: async ({ token, secret, maxAge }) => {
                if (
                    req.query.nextauth?.includes('callback') &&
                    req.query.nextauth.includes('credentials') &&
                    req.method === 'POST'
                ) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
                    const cookies = new Cookies(req, res);
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
                    const cookie = cookies.get('next-auth.session-token');
                    if (cookie) return cookie;
                    else return '';
                }

                // Revert to default behaviour when not in the credentials provider callback flow
                return encode({ token, secret, maxAge });
            },
            decode: async ({ token, secret }) => {
                if (
                    req.query.nextauth?.includes('callback') &&
                    req.query.nextauth.includes('credentials') &&
                    req.method === 'POST'
                ) {
                    return null;
                }

                // Revert to default behaviour when not in the credentials provider callback flow
                return decode({ token, secret });
            },
        },

        secret: process.env.NEXTAUTH_SECRET,
        debug: true,
        providers: [
            GithubProvider({
                clientId: env.GITHUB_ID,
                clientSecret: env.GITHUB_SECRET,
            }),
            EmailProvider({
                from: env.AWS_FROM_EMAIL,
                server: {
                    host: env.AWS_SES_HOST,
                    port: env.AWS_SES_PORT,
                    auth: {
                        user: env.AWS_SES_USER,
                        pass: env.AWS_SES_PASSWORD,
                    },
                },
            }),
            CredentialProvider({
                name: 'CredentialProvider',
                credentials: {
                    email: {
                        label: 'Електронна пошта',
                        type: 'text',
                        placeholder: 'worldbestoperator@gmail.com',
                        value: 'admin@gmail.com',
                    },
                    password: {
                        label: 'Пароль',
                        type: 'password',
                        placeholder: '*&fhio2)!_3krr-)(#(!@$f;p[e]',
                        value: '*&fhio2)!_3krr-)(#(!@$f;p[e]',
                    },
                },
                async authorize(credentials, req) {
                    if (!credentials) return null;

                    const user = await db.user.findUnique({
                        where: {
                            email: credentials?.email,
                        },
                    });

                    if (!user || user.password === null) return null;

                    if (
                        !(await bcrypt.compare(
                            credentials?.password,
                            user.password,
                        ))
                    )
                        return null;

                    return user;
                },
            }),
        ],
    };

    return [req, res, opts];
}
