import NextAuth, { type DefaultSession, type NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
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
import { getFromEmail } from '~/utils/email';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
            busyness: number;
            roles: string[];
            permissions: string[];

            suspended: boolean;
        };
    }

    interface DefaultUser {
        id: string;
        busyness: number;

        suspended: boolean;
    }
}

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const data = requestWrapper(req, res);
    // It is 'any' in the lib code, so there's not much we can do
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
        pages: { signIn: '/signin' },
        callbacks: {
            async session({ session, user }) {
                if (user.suspended) throw new Error('User is suspended');

                session.user.id = user.id;
                session.user.name = user.name ?? '';
                session.user.image = user.image ?? '/images/default_avatar.png';
                session.user.email = user.email;
                session.user.busyness = user.busyness;

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
                        roles: {
                            select: {
                                permissions: {
                                    select: {
                                        title: true,
                                    },
                                },
                            },
                        },
                    },
                });

                if (u?.permissions) {
                    let permissions = u.permissions.map(
                        (permission) => permission.title,
                    );

                    if (u?.roles) {
                        permissions = [
                            ...permissions,
                            ...u.roles.map((role) =>
                                role.permissions.map(
                                    (permission) => permission.title,
                                ),
                            ),
                        ].flat();
                    }

                    session.user.permissions = new Array(
                        ...new Set(permissions),
                    );
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

                return session;
            },
            async signIn({
                user,
                account: _1,
                profile: _2,
                email: _3,
                credentials: _4,
            }) {
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

                return !user.suspended;
            },
        },
        jwt: {
            encode: async ({ token, secret, maxAge }): Promise<string> => {
                if (
                    req.query.nextauth?.includes('callback') &&
                    req.query.nextauth.includes('credentials') &&
                    req.method === 'POST'
                ) {
                    // TODO: this function is a type disaster
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
                    const cookies = new Cookies(req, res);
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
                    const cookie = cookies.get('next-auth.session-token');
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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

        secret: env.NEXTAUTH_SECRET,
        providers: [
            GithubProvider({
                clientId: env.GITHUB_ID,
                clientSecret: env.GITHUB_SECRET,
            }),
            GoogleProvider({
                clientId: env.GOOGLE_ID,
                clientSecret: env.GOOGLE_SECRET,
            }),
            Facebook({
                clientId: env.FACEBOOK_ID,
                clientSecret: env.FACEBOOK_SECRET,
            }),
            EmailProvider({
                from: getFromEmail({
                    local: 'magic',
                }),
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
                async authorize(credentials, _req) {
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
                        )) ||
                        user.suspended
                    )
                        return null;

                    return user;
                },
            }),
        ],
    };

    return [req, res, opts];
}
