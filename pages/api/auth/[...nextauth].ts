import NextAuth, { type NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '#prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import Cookies from 'cookies';
import { decode, encode } from 'next-auth/jwt';
import { Chat, Message } from '@prisma/client';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
            role: number;
            isOnline: boolean;
        };
        personnel: {
            chats: Record<number, Chat>;
        };
    }

    interface DefaultUser {
        id: string;
        role: number;
        isOnline: boolean;
    }
}

interface ExtendedChat extends Chat {
    messages?: Message[];
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

    const adapter = PrismaAdapter(prisma);

    const opts: NextAuthOptions = {
        // Include user.id on session
        adapter: adapter,
        callbacks: {
            async session({ session, user }) {
                session.user.id = user.id;
                session.user.name = user.name;
                session.user.email = user.email;
                session.user.role = user.role;
                session.user.isOnline = user.isOnline;

                const chatList = await prisma.chat.findMany({
                    where: {
                        personnelId: user.id,
                    },
                });

                const chats: Record<number, ExtendedChat> = {};

                for (const chat of chatList) {
                    chats[chat.id] = chat;
                }

                for (const chatId in chats) {
                    chats[chatId].messages = await prisma.message.findMany({
                        where: {
                            chatId: Number(chatId),
                        },
                    });
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

                        await adapter.createSession({
                            sessionToken: sessionToken,
                            userId: user.id,
                            expires: sessionExpiry,
                        });

                        const cookies = new Cookies(req, res);

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
                    const cookies = new Cookies(req, res);
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
        // Configure one or more authentication providers
        secret: process.env.NEXTAUTH_SECRET,
        debug: true,
        providers: [
            GithubProvider({
                clientId: process.env.GITHUB_ID,
                clientSecret: process.env.GITHUB_SECRET,
            }),
            CredentialProvider({
                name: 'CredentialProvider',
                credentials: {
                    email: {
                        label: 'email',
                        type: 'text',
                        placeholder: 'worldbestoperator@gmail.com',
                        value: 'admin@gmail.com',
                    },
                    password: {
                        label: 'Password',
                        type: 'password',
                        placeholder: '*&fhio2)!_3krr-)(#(!@$f;p[e]',
                        value: '*&fhio2)!_3krr-)(#(!@$f;p[e]',
                    },
                },
                async authorize(credentials, req) {
                    console.log(credentials);

                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials?.email,
                        },
                    });

                    if (!user) return null;

                    if (user.password === null) return null;

                    if (user.password !== credentials?.password) return null;

                    return user;
                },
            }),
        ],
    };

    return [req, res, opts];
}
