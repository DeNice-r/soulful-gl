import { createTRPCRouter, spaProcedure } from '~/server/api/trpc';
import { z } from '~/utils/zod';
import { IntervalMs } from '~/utils/types';

export const statsRouter = createTRPCRouter({
    list: spaProcedure
        .input(
            z
                .object({
                    intervalName: z.enum(['day', 'hour']).default('day'),
                    intervalNumber: z.number().default(30),
                })
                .default({ intervalName: 'day', intervalNumber: 30 }),
        )
        .query(async ({ ctx, input: { intervalName, intervalNumber } }) => {
            const [
                messengerUserCount,
                userCount,
                operatorCount,
                messageCount,
                recentMessageCount,
                recentArchivedMessageCount,
                chatCount,
                ongoingChats,
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
                ctx.db.$queryRawUnsafe(`
                    WITH TimeRanges AS (
                        SELECT generate_series(date_trunc('${intervalName}', CURRENT_TIMESTAMP - interval '${intervalNumber} ${intervalName}'), 
                            date_trunc('${intervalName}', CURRENT_TIMESTAMP), 
                            '1 ${intervalName}') AS interval_start
                    )
                    SELECT 
                        tr.interval_start AS a,
                        COALESCE(SUM(message_count), 0) AS b
                    FROM TimeRanges AS tr
                    LEFT JOIN (
                        SELECT m."createdAt"::date AS message_date, COUNT(*) AS message_count
                        FROM "Message" m
                        WHERE m."createdAt" >= CURRENT_TIMESTAMP - interval '${intervalNumber} ${intervalName}'
                        GROUP BY m."createdAt"::date
                        UNION ALL
                        SELECT am."createdAt"::date, COUNT(*) AS message_ref
                        FROM "ArchivedMessage" am
                        WHERE am."createdAt" >= CURRENT_TIMESTAMP - interval '${intervalNumber} ${intervalName}'
                        GROUP BY am."createdAt"::date
                    ) AS messages ON messages.message_date = tr.interval_start::date
                    GROUP BY tr.interval_start
                    ORDER BY tr.interval_start;
                `),
                ctx.db.message.count({
                    where: {
                        createdAt: {
                            gt: new Date(Date.now() - IntervalMs[intervalName]),
                        },
                    },
                }),
                ctx.db.archivedMessage.count({
                    where: {
                        createdAt: {
                            gt: new Date(Date.now() - IntervalMs[intervalName]),
                        },
                    },
                }),
                ctx.db.$queryRawUnsafe(`
                    WITH TimeRanges AS (
                        SELECT generate_series(date_trunc('${intervalName}', CURRENT_TIMESTAMP - interval '${intervalNumber} ${intervalName}'), 
                            date_trunc('${intervalName}', CURRENT_TIMESTAMP), 
                            '1 ${intervalName}') AS interval_start
                    ),
                    OpenChats AS (
                        SELECT tr."interval_start",
                               COUNT(c.id) AS open_chats_count
                        FROM TimeRanges AS tr
                        LEFT JOIN "Chat" c ON c."createdAt" <= tr."interval_start"
                        GROUP BY tr."interval_start"
                    ),
                    ArchivedChats AS (
                        SELECT tr.interval_start,
                               COUNT(ac.id) AS archived_chats_count
                        FROM TimeRanges tr
                        LEFT JOIN "ArchivedChat" ac ON ac."createdAt" <= tr.interval_start AND ac."endedAt" > tr.interval_start
                        GROUP BY tr."interval_start"
                    )
                    SELECT tr.interval_start AS a,
                           COALESCE(oc.open_chats_count, 0) + COALESCE(ac.archived_chats_count, 0) AS b
                    FROM TimeRanges tr
                    LEFT JOIN OpenChats oc ON tr.interval_start = oc.interval_start
                    LEFT JOIN ArchivedChats ac ON tr.interval_start = ac.interval_start
                    ORDER BY tr.interval_start;
                `),
                ctx.db.chat.findMany(),
            ]);

            if (Array.isArray(chatCount))
                chatCount.push({ a: new Date(), b: ongoingChats.length });
            if (Array.isArray(messageCount))
                messageCount.push({
                    a: new Date(),
                    b: recentMessageCount + recentArchivedMessageCount,
                });

            const avgDuration =
                ongoingChats.reduce(
                    (acc, chat) => acc + Date.now() - chat.createdAt.getTime(),
                    0,
                ) / ongoingChats.length;

            return {
                numbers: {
                    messengerUserCount,
                    userCount,
                    operatorCount,
                },
                diffs: {
                    avgDuration,
                },
                graphs: {
                    dailyMessageCount: messageCount,
                    dailyChatCount: chatCount,
                },
            };
        }),
});
