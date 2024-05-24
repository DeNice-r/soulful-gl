import {
    createTRPCRouter,
    publicMultilevelSpaProcedure,
    publicProcedure,
    spaProcedure,
} from '~/server/api/trpc';
import {
    NumberIdSchema,
    PageSchema,
    UserQandASchema,
    QandAUdateSchema,
    SetBooleanNumberIdSchema,
    AdminQandASchema,
} from '~/utils/schemas';
import { getIsFullAccess } from '~/utils/auth';
import { SearchableQnAFields } from '~/utils/types';
import { sendQandaDeleteEmail, sendQandaEmail } from '~/utils/email/templates';

export const qandaRouter = createTRPCRouter({
    list: publicMultilevelSpaProcedure
        .input(PageSchema)
        .query(
            async ({ input: { page, limit, query, orderBy, order }, ctx }) => {
                const contains = {
                    contains: query,
                    mode: 'insensitive',
                };

                const containsQuery: object = {
                    OR: [
                        ...Object.values(SearchableQnAFields).map((field) => ({
                            [field]: contains,
                        })),

                        {
                            tags: {
                                some: {
                                    title: {
                                        contains: query,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        },
                    ],
                };

                const where: object = {
                    ...(query && {
                        where: {
                            ...containsQuery,
                            published: getIsFullAccess(ctx) ? undefined : true,
                        },
                    }),
                };

                const [count, values] = await ctx.db.$transaction([
                    ctx.db.qandA.count(where),
                    ctx.db.qandA.findMany({
                        where,
                        orderBy: {
                            [orderBy ? orderBy : 'createdAt']: order
                                ? order
                                : 'desc',
                        },
                        skip: (page - 1) * limit,
                        take: limit,
                    }),
                ]);

                return {
                    count,
                    values,
                };
            },
        ),

    get: spaProcedure
        .input(NumberIdSchema)
        .query(async ({ input: id, ctx }) => {
            return ctx.db.qandA.findUnique({
                where: { id },
            });
        }),

    create: publicProcedure
        .input(UserQandASchema)
        .mutation(async ({ ctx, input: data }) => {
            return ctx.db.qandA.create({
                data,
            });
        }),

    adminCreate: spaProcedure
        .input(AdminQandASchema)
        .mutation(async ({ ctx, input: data }) => {
            return ctx.db.qandA.create({
                data: {
                    ...data,

                    authorEmail: ctx.session.user.email,
                    authorName: ctx.session.user.name,

                    published: true,
                },
            });
        }),

    update: spaProcedure
        .input(QandAUdateSchema)
        .mutation(async ({ ctx, input: { id, published, ...data } }) => {
            const [oldQanda, newQanda] = await ctx.db.$transaction([
                ctx.db.qandA.findUnique({
                    where: { id },
                }),
                ctx.db.qandA.update({
                    where: {
                        id,
                    },
                    data: {
                        ...data,
                        published: published ?? undefined,
                    },
                }),
            ]);

            if (!oldQanda?.answer && newQanda.answer && oldQanda?.authorEmail) {
                await sendQandaEmail(
                    oldQanda?.authorEmail,
                    oldQanda?.authorName ?? 'Анонім',
                    newQanda?.question,
                    newQanda.answer,
                );
            }
        }),

    publish: spaProcedure
        .input(SetBooleanNumberIdSchema)
        .mutation(async ({ ctx, input: { id, value } }) => {
            return ctx.db.qandA.update({
                where: {
                    id,
                },
                data: {
                    published: value,
                },
            });
        }),

    delete: spaProcedure
        .input(NumberIdSchema)
        .mutation(async ({ ctx, input }) => {
            const deletedQanda = await ctx.db.qandA.delete({
                where: {
                    id: input,
                },
            });

            if (deletedQanda?.authorEmail && !deletedQanda?.answer) {
                await sendQandaDeleteEmail(
                    deletedQanda?.authorEmail,
                    deletedQanda?.authorName ?? 'Анонім',
                    deletedQanda?.question,
                );
            }
        }),
});
