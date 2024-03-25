import {
    adminProcedure,
    createTRPCRouter,
    permissionProcedure,
    publicProcedure,
} from '~/server/api/trpc';
import {
    CUIDSchema,
    PageSchema,
    RecommendationSchema,
    RecommendationUpdateSchema,
} from '~/utils/schemas';
import { isAtLeast } from '~/utils/authAssertions';
import { UserRole } from '~/utils/types';
import { type z } from 'zod';

function getUpdateData(input: z.infer<typeof RecommendationUpdateSchema>) {
    return {
        title: input.title,
        description: input.description,
        image: input.image,

        published: input.published,
    };
}

export const recommendationRouter = createTRPCRouter({
    get: publicProcedure.input(PageSchema).query(async ({ input, ctx }) => {
        return ctx.db.recommendation.findMany({
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

    getById: publicProcedure.input(CUIDSchema).query(async ({ input, ctx }) => {
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
                    isAtLeast(ctx?.session.user?.role, UserRole.ADMIN)))
        )
            return recommendation;

        return null;
    }),

    getOwnUnpublished: permissionProcedure
        .input(PageSchema)
        .query(async ({ input, ctx }) => {
            return ctx.db.recommendation.findMany({
                where: {
                    authorId: ctx.session.user.id,
                    published: false,
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

    getAnyUnpublished: permissionProcedure
        .input(PageSchema)
        .query(async ({ input, ctx }) => {
            return ctx.db.recommendation.findMany({
                where: {
                    published: false,
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

    updateOwn: permissionProcedure
        .input(RecommendationUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.recommendation.update({
                where: { id: input.id, authorId: ctx.session.user.id },
                data: getUpdateData(input),
            });
        }),

    updateAny: permissionProcedure
        .input(RecommendationUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.recommendation.update({
                where: { id: input.id },
                data: getUpdateData(input),
            });
        }),

    deleteOwn: permissionProcedure
        .input(CUIDSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.recommendation.delete({
                where: { id: input, authorId: ctx.session.user.id },
            });
        }),

    deleteAny: adminProcedure
        .input(CUIDSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.recommendation.delete({ where: { id: input } });
        }),
});
