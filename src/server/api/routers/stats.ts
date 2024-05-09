import { createTRPCRouter, spaProcedure } from '~/server/api/trpc';
import { DAY_MS } from '~/utils/constants';

export const statsRouter = createTRPCRouter({
    list: spaProcedure.query(async ({ ctx }) => {
        const [
            messengerUserCount,
            userCount,
            operatorCount,
            ongoingChats,
            ongoingMsgCount,
            recentChats,
            recentMsgCount,
        ] = await Promise.all([
            ctx.db.user.count({
                where: {
                    email: null,
                },
            }),
            ctx.db.user.count({
                where: {
                    NOT: {
                        email: null,
                    },
                },
            }),
            ctx.db.user.count({
                where: {
                    permissions: {
                        some: {
                            title: {
                                in: ['chat:*', 'chat:*:*', '*:*', '*:*:*'],
                            },
                        },
                    },
                },
            }),
            ctx.db.chat.findMany({
                select: {
                    createdAt: true,
                },
            }),
            ctx.db.message.count(),
            ctx.db.archivedChat.findMany({
                where: {
                    createdAt: {
                        gt: new Date(Date.now() - DAY_MS * 7),
                    },
                },
                select: {
                    createdAt: true,
                    endedAt: true,
                },
            }),
            ctx.db.archivedMessage.count({
                where: {
                    createdAt: {
                        gt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
                    },
                },
            }),
        ]);

        const avgDuration =
            ongoingChats.reduce(
                (acc, chat) => acc + Date.now() - chat.createdAt.getTime(),
                0,
            ) / ongoingChats.length;
        const recentAvgDuration =
            recentChats.reduce(
                (acc, chat) =>
                    acc + (chat.endedAt.getTime() - chat.createdAt.getTime()),
                0,
            ) / recentChats.length;

        return {
            numbers: {
                messengerUserCount,
                userCount,
                operatorCount,
                ongoingCount: ongoingChats.length,
                ongoingMsgCount,
                recentCount: recentChats.length,
                recentMsgCount,
            },
            diffs: {
                avgDuration,
                recentAvgDuration,
            },
        };
    }),
});
