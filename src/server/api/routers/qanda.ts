import {
    createTRPCRouter,
    permissionProcedure,
    publicProcedure,
} from '~/server/api/trpc';
import {
    NumberIdSchema,
    QandASchema,
    QandAUdateSchema,
    SearchSchema,
} from '~/utils/schemas';

export const qandaRouter = createTRPCRouter({
    list: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.qandA.findMany({
            where: {
                published: true,
            },

            orderBy: { createdAt: 'desc' },
        });
    }),

    search: permissionProcedure
        .input(SearchSchema)
        .query(async ({ input: { query, limit, page, published }, ctx }) => {
            return ctx.db.qandA.findMany({
                ...(query && {
                    where: {
                        question: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    },
                }),

                ...(typeof published === 'boolean' && {
                    where: {
                        published,
                    },
                }),

                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            });
        }),

    create: permissionProcedure
        .input(QandASchema)
        .mutation(async ({ ctx, input: data }) => {
            return ctx.db.qandA.create({
                data,
            });
        }),

    update: permissionProcedure
        .input(QandAUdateSchema)
        .mutation(async ({ ctx, input: { id, published, ...data } }) => {
            return ctx.db.qandA.update({
                where: {
                    id,
                },
                data: {
                    ...data,
                    published: published ?? undefined,
                },
            });
        }),

    delete: permissionProcedure
        .input(NumberIdSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.qandA.delete({
                where: {
                    id: input,
                },
            });
        }),
});
