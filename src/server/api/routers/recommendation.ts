import {
    createTRPCRouter,
    permissionProcedure,
    publicProcedure,
} from '~/server/api/trpc';
import {
    CountSchema,
    CUIDSchema,
    PageSchema,
    RecommendationSchema,
    RecommendationUpdateSchema,
    SetBooleanSchema,
} from '~/utils/schemas';
import { SearchableRecommendationFields } from '~/utils/types';
import { getFullAccessConstraintWithAuthor } from '~/utils/auth';

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

                const where: object = {
                    ...(query && {
                        where: {
                            ...containsQuery,
                            ...getFullAccessConstraintWithAuthor(ctx),
                        },
                    }),
                };

                const [count, values] = await ctx.db.$transaction([
                    ctx.db.recommendation.count(where),
                    ctx.db.recommendation.findMany({
                        where,
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
        return ctx.db.recommendation.findUnique({
            where: { id: input, ...getFullAccessConstraintWithAuthor(ctx) },
            include: {
                author: {
                    select: { name: true },
                },
            },
        });
    }),

    random: publicProcedure.input(CountSchema).query(async ({ input, ctx }) => {
        return ctx.db
            .$queryRaw`select * from "Recommendation" limit ${input} offset floor(random() * (select count(*) from "Recommendation"));` as Promise<
            {
                id: number;
                title: string;
                description: string;
            }[]
        >;
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
