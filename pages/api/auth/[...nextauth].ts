import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHub from 'next-auth/providers/github';
import prisma from '../../../lib/prisma';
import { Chat } from '@prisma/client';

const authHandler: NextApiHandler = (req, res) =>
    NextAuth(req, res, authOptions);
export default authHandler;

declare module 'next-auth' {
    interface Session {
        user: {
            id: number;
            name: string;
            email: string;
            image: string;
            role: number;
            status: boolean;
        };
        personnel: {
            chats: Record<number, Chat>[];
        };
    }
}

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

async function session({ session, user }) {
    session.user.id = user.id;
    session.user.role = user.role;
    session.user.status = user.isOnline;

    const chatList = await prisma.chat.findMany({
        where: {
            personnelId: user.id,
        },
    });

    const chats: Record<number, Chat> = {};

    for (const chat of chatList) {
        chats[chat.id] = chat;
    }

    for (const chatId in chats) {
        chats[chatId].messages = await prisma.message.findMany({
            where: {
                chatId: Number(chatId),
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    session.personnel = { chats };
    return session;
}
