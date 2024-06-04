import { createTRPCRouter, spaProcedure } from '~/server/api/trpc';
import { BusynessSchema, NumberIdSchema } from '~/utils/schemas';
import { archiveChat } from '~/server/api/routers/common';
import { getHelp } from '~/utils/openai';

export const chatRouter = createTRPCRouter({
    list: spaProcedure.query(async ({ ctx }) => {
        const chats = await ctx.db.chat.findMany({
            where: {
                personnelId: ctx.session.user.id,
            },

            orderBy: { createdAt: 'desc' },
        });

        return chats.map((chat) => ({
            [chat.id]: chat,
        }));
    }),

    listFull: spaProcedure.query(async ({ ctx }) => {
        const chatList = await ctx.db.chat.findMany({
            where: {
                personnelId: ctx.session.user.id,
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (!chatList) return {};

        const chatMap: Record<number, (typeof chatList)[number]> = {};
        for (const chat of chatList) {
            chatMap[chat.id] = chat;
        }

        return chatMap;
    }),

    get: spaProcedure.input(NumberIdSchema).query(async ({ ctx, input }) => {
        return ctx.db.chat.findFirst({
            where: {
                id: input,
                personnelId: ctx.session.user.id,
            },
        });
    }),

    getFull: spaProcedure
        .input(NumberIdSchema)
        .query(async ({ ctx, input: id }) => {
            return ctx.db.chat.update({
                where: {
                    id,
                    OR: [
                        {
                            personnelId: ctx.session.user.id,
                        },

                        {
                            personnelId: null,
                        },
                    ],
                },
                data: {
                    personnelId: ctx.session.user.id,
                },
                include: {
                    messages: {
                        orderBy: {
                            createdAt: 'asc',
                        },
                    },
                },
            });
        }),

    archive: spaProcedure
        .input(NumberIdSchema)
        .mutation(async ({ ctx, input }) => {
            return archiveChat(input, ctx);
        }),

    report: spaProcedure
        .input(NumberIdSchema)
        .mutation(async ({ ctx, input: id }) => {
            const result = await ctx.db.user.updateMany({
                where: {
                    userChat: {
                        id,
                        personnelId: ctx.session.user.id,
                    },
                },
                data: {
                    reportCount: {
                        increment: 1,
                    },
                },
            });

            if (result.count === 0) return false;

            return archiveChat(id, ctx);
        }),

    listUnassigned: spaProcedure.query(async ({ ctx }) => {
        return ctx.db.chat.findMany({
            where: {
                personnelId: null,
            },
            orderBy: { createdAt: 'asc' },
        });
    }),

    setBusyness: spaProcedure
        .input(BusynessSchema)
        .mutation(async ({ ctx, input: busyness }) => {
            return ctx.db.user.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: {
                    busyness,
                },
            });
        }),

    listHelp: spaProcedure
        .input(NumberIdSchema)
        .query(async ({ ctx, input: chatId }) => {
            return (
                ctx.db.gptMessage.findMany({
                    where: {
                        chatId,
                        chat: {
                            personnelId: ctx.session.user.id,
                        },
                    },
                    include: {
                        message: {
                            select: {
                                text: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                }) ?? []
            );
        }),

    getHelp: spaProcedure
        .input(NumberIdSchema)
        .mutation(async ({ ctx, input: chatId }) => {
            const [messages, qandA] = await ctx.db.$transaction([
                ctx.db.message.findMany({
                    where: {
                        chatId,
                        chat: {
                            personnelId: ctx.session.user.id,
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                    select: {
                        id: true,
                        text: true,
                        isFromUser: true,
                    },
                }),
                ctx.db.qandA.findMany({
                    where: {
                        published: true,
                    },
                    select: {
                        question: true,
                        answer: true,
                    },
                }),
            ]);
            if (!messages) throw new Error('Чат не знайдено');

            const oldHelp = await ctx.db.gptMessage.findFirst({
                where: {
                    messageId: messages[messages.length - 1].id,
                },
                select: {
                    id: true,
                },
            });
            if (oldHelp)
                throw new Error(
                    'Ви вже отримали допомогу для цього повідомлення',
                );

            const gptMessagePromise = getHelp([
                ...qandA.map(({ question, answer }) => ({
                    role: 'system' as const,
                    content: `${question}\n${answer}`,
                })),
                ...messages.map((message) => ({
                    role: 'user' as const,
                    name: message.isFromUser ? 'user' : 'psychologist',
                    content: message.text,
                })),
            ]);

            let lastUserMessageId: number | null = null;
            for (const message of messages) {
                if (message.isFromUser) {
                    lastUserMessageId = message.id;
                }
            }

            return ctx.db.gptMessage.create({
                data: {
                    chatId,
                    messageId: lastUserMessageId,
                    text: await gptMessagePromise,
                },
                include: {
                    message: {
                        select: {
                            text: true,
                        },
                    },
                },
            });
        }),
});
