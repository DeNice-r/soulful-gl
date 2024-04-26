import { createTRPCRouter, spaProcedure } from '~/server/api/trpc';
import { NumberIdSchema } from '~/utils/schemas';

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
        .query(async ({ ctx, input }) => {
            return ctx.db.chat.findFirst({
                where: {
                    id: input,
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
            const chat = await ctx.db.chat.findFirst({
                where: {
                    id: input,
                    personnelId: ctx.session.user.id,
                },
                include: {
                    messages: {
                        select: {
                            text: true,
                            createdAt: true,
                            isFromUser: true,
                        },
                    },
                },
            });

            if (!chat) return false;

            await ctx.db.$transaction([
                ctx.db.archivedChat.create({
                    data: {
                        personnelId: chat.personnelId,
                        userId: chat.userId,
                        createdAt: chat.createdAt,
                        messages: {
                            create: chat.messages,
                        },
                    },
                }),
                ctx.db.chat.delete({
                    where: {
                        id: input,
                    },
                    include: {
                        messages: true,
                    },
                }),
            ]);

            return true;
        }),

    // todo: user starting chat on the site, better use router api instead
    // create: protectedProcedure
    //     .input(MessageSchema)
    //     .mutation(async ({ ctx, input }) => {
    //         return ctx.db.chat.create({
    //             data: {
    //                 personnelId: ,
    //                 messages: {
    //                     create: input,
    //                 },
    //             },
    //         });
    //     }),

    // search: permissionProcedure
    //     .input(SearchSchema)
    //     .query(async ({ input: { query, limit, page, published }, ctx }) => {
    //         return ctx.db.qandA.findMany({
    //             ...(query && {
    //                 where: {
    //                     question: {
    //                         contains: query,
    //                         mode: 'insensitive',
    //                     },
    //                 },
    //             }),
    //
    //             ...(typeof published === 'boolean' && {
    //                 where: {
    //                     published,
    //                 },
    //             }),
    //
    //             orderBy: { createdAt: 'desc' },
    //             skip: (page - 1) * limit,
    //             take: limit,
    //         });
    //     }),
});
