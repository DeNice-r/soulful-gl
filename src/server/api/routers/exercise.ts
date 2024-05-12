import {
    CUIDSchema,
    ExerciseSchema,
    ExerciseStepSchema,
    ExerciseUpdateSchema,
    PageSchema,
} from '~/utils/schemas';

import {
    createTRPCRouter,
    permissionProcedure,
    publicProcedure,
} from '~/server/api/trpc';
import { SearchableExerciseFields } from '~/utils/types';
import { getFullAccessConstraint } from '~/utils/auth';

export const exerciseRouter = createTRPCRouter({
    list: publicProcedure
        .input(PageSchema)
        .query(
            async ({ input: { page, limit, query, orderBy, order }, ctx }) => {
                const contains = {
                    contains: query,
                    mode: 'insensitive',
                };

                if (orderBy === 'author') orderBy = 'authorId';

                const containsQuery: object = {
                    OR: [
                        ...Object.values(SearchableExerciseFields).map(
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
                            ...getFullAccessConstraint(ctx),
                        },
                    }),
                };

                const [count, values] = await ctx.db.$transaction([
                    ctx.db.post.count(where),
                    ctx.db.post.findMany({
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
        return ctx.db.exercise.findUnique({
            where: {
                id: input,
                ...getFullAccessConstraint(ctx),
            },
            include: {
                author: {
                    select: { name: true },
                },
                steps: true,
            },
        });
    }),

    create: permissionProcedure
        .input(ExerciseSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exercise.create({
                data: {
                    ...input,
                    tags: {
                        connectOrCreate: input.tags.map((tag) => ({
                            where: { title: tag },
                            create: { title: tag },
                        })),
                    },
                    steps: {
                        connectOrCreate: input.steps.map((step) => ({
                            where: { id: step.id },
                            create: { ...step },
                        })),
                    },
                    author: {
                        connect: { id: ctx.session.user.id },
                    },
                },
            });
        }),

    createStep: permissionProcedure
        .input(ExerciseStepSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exerciseStep.create({
                data: {
                    ...input,
                    author: {
                        connect: { id: ctx.session.user.id },
                    },
                },
            });
        }),

    update: permissionProcedure
        .input(ExerciseUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exercise.update({
                where: {
                    id: input.id,
                    ...(!ctx.isFullAccess && { authorId: ctx.session.user.id }),
                },
                data: {
                    title: input.title,
                    description: input.description,
                    image: input.image,

                    ...(input.tags && {
                        tags: {
                            connectOrCreate: input.tags.map((tag) => ({
                                where: { title: tag },
                                create: { title: tag },
                            })),
                        },
                    }),
                    ...(input.steps && {
                        steps: {
                            connectOrCreate: input.steps.map((step) => ({
                                where: { id: step.id },
                                create: { ...step },
                            })),
                        },
                    }),
                },
            });
        }),

    updateStep: permissionProcedure
        .input(ExerciseStepSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exerciseStep.update({
                where: {
                    id: input.id,
                    ...(!ctx.isFullAccess && { authorId: ctx.session.user.id }),
                },
                data: {
                    title: input.title,
                    description: input.description,
                    image: input.image,
                },
            });
        }),

    delete: permissionProcedure
        .input(CUIDSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exercise.delete({
                where: {
                    id: input,
                    ...(!ctx.isFullAccess && { authorId: ctx.session.user.id }),
                },
            });
        }),

    deleteStep: permissionProcedure
        .input(CUIDSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exerciseStep.delete({
                where: {
                    id: input,
                    ...(!ctx.isFullAccess && { authorId: ctx.session.user.id }),
                },
            });
        }),
});
