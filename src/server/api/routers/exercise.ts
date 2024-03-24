import {
    CUIDObjectSchema,
    ExerciseSchema,
    ExerciseStepSchema,
    ExerciseUpdateSchema,
    PageSchema,
} from '~/utils/schemas';

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from '~/server/api/trpc';

export const exerciseRouter = createTRPCRouter({
    get: publicProcedure.input(PageSchema).query(async ({ input, ctx }) => {
        return ctx.db.exercise.findMany({
            orderBy: { createdAt: 'desc' },
            skip: (input.page - 1) * input.limit,
            take: input.limit,
        });
    }),

    create: protectedProcedure
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

    createStep: protectedProcedure
        .input(ExerciseStepSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exerciseStep.create({
                data: input,
            });
        }),

    update: protectedProcedure
        .input(ExerciseUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exercise.update({
                where: { id: input.id },
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

    updateStep: protectedProcedure
        .input(ExerciseStepSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exerciseStep.update({
                where: { id: input.id },
                data: input,
            });
        }),

    delete: protectedProcedure
        .input(CUIDObjectSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exercise.delete({ where: { ...input } });
        }),

    deleteStep: protectedProcedure
        .input(CUIDObjectSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exerciseStep.delete({ where: { ...input } });
        }),
});
