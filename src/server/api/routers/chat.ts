import { createTRPCRouter, spaProcedure } from '~/server/api/trpc';
import { BusynessSchema, NumberIdSchema } from '~/utils/schemas';
import { archiveChat } from '~/server/api/routers/common';

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
            return ctx.db.chat.update({
                where: {
                    id: input,
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
