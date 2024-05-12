import {
    createTRPCRouter,
    permissionProcedure,
    publicProcedure,
} from '~/server/api/trpc';
import {
    CUIDSchema,
    PageSchema,
    RecommendationSchema,
    RecommendationUpdateSchema,
    SetBooleanSchema,
} from '~/utils/schemas';
import { isPermitted } from '~/utils/authAssertions';
import { AccessType, SearchableRecommendationFields } from '~/utils/types';

export const recommendationRouter = createTRPCRouter({
    list: publicProcedure
        .input(PageSchema)
        .query(
            async ({ input: { page, limit, query, orderBy, order }, ctx }) => {
                const contains = {
                    contains: query,
                    mode: 'insensitive',
                };

                const containsQuery: object = {
                    OR: [
                        ...Object.values(SearchableRecommendationFields).map(
                            (field) => ({
                                [field]: contains,
                            }),
                        ),

                        {
                            author: {
                                name: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                        },

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

                const [count, values] = await ctx.db.$transaction([
                    ctx.db.recommendation.count({
                        ...(query && {
                            where: containsQuery,
                        }),
                    }),
                    ctx.db.recommendation.findMany({
                        ...(query && {
                            where: containsQuery,
                        }),
                        include: {
                            author: {
                                select: { name: true },
                            },
                        },
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

    get: publicProcedure.input(CUIDSchema).query(async ({ input, ctx }) => {
        const recommendation = await ctx.db.recommendation.findUnique({
            where: { id: input },
            include: {
                author: {
                    select: { name: true },
                },
            },
        });

        if (!recommendation) return null;

        if (
            recommendation.published ||
            (ctx.session &&
                (ctx.session.user.id === recommendation.authorId ||
                    isPermitted(
                        ctx.session?.user?.permissions,
                        ctx.entity,
                        ctx.action,
                    ) === AccessType.ALL))
        )
            return recommendation;

        return null;
    }),

    getUnpublished: permissionProcedure
        .input(PageSchema)
        .query(async ({ input, ctx }) => {
            return ctx.db.recommendation.findMany({
                where: {
                    published: false,
                    ...(!ctx.isFullAccess && { authorId: ctx.session.user.id }),
                },
                include: {
                    author: {
                        select: { name: true },
                    },
                },

                orderBy: { createdAt: 'desc' },
                skip: (input.page - 1) * input.limit,
                take: input.limit,
            });
        }),

    create: permissionProcedure
        .input(RecommendationSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.recommendation.create({
                data: {
                    ...input,
                    author: {
                        connect: { id: ctx.session.user.id },
                    },
                },
            });
        }),

    update: permissionProcedure
        .input(RecommendationUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.recommendation.update({
                where: {
                    id: input.id,
                    ...(!ctx.isFullAccess && { authorId: ctx.session.user.id }),
                },
                data: {
                    title: input.title,
                    description: input.description,
                    image: input.image,

                    published: input.published,
                },
            });
        }),

    publish: permissionProcedure
        .input(SetBooleanSchema)
        .mutation(async ({ ctx, input: { id, value } }) => {
            return ctx.db.recommendation.update({
                where: {
                    id,
                    ...(!ctx.isFullAccess && { authorId: ctx.session.user.id }),
                },
                data: {
                    published: value,
                },
            });
        }),

    delete: permissionProcedure
        .input(CUIDSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.recommendation.delete({
                where: {
                    id: input,
                    ...(!ctx.isFullAccess && { authorId: ctx.session.user.id }),
                },
            });
        }),
});
