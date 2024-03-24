import {
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
    get: publicProcedure.input(PageSchema).query(({ input, ctx }) => {
        const exercises = ctx.db.exercise.findMany({
            orderBy: { createdAt: 'desc' },
            skip: (input.page - 1) * input.limit,
            take: input.limit,
        });

        return {
            exercises,
        };
    }),

    create: protectedProcedure
        .input(ExerciseSchema)
        .mutation(async ({ ctx, input }) => {
            const exercise = ctx.db.exercise.create({
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

            return {
                exercise,
            };
        }),

    createStep: protectedProcedure
        .input(ExerciseStepSchema)
        .mutation(async ({ ctx, input }) => {
            const step = ctx.db.exerciseStep.create({
                data: input,
            });

            return {
                step,
            };
        }),

    update: protectedProcedure
        .input(ExerciseUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const exercise = ctx.db.exercise.update({
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

            return {
                exercise,
            };
        }),

    getSecretMessage: protectedProcedure.query(() => {
        return 'you can now see this secret message!';
    }),
});
