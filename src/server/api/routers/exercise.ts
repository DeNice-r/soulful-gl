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

export const exerciseRouter = createTRPCRouter({
    get: publicProcedure.input(PageSchema).query(async ({ input, ctx }) => {
        return ctx.db.exercise.findMany({
            orderBy: { createdAt: 'desc' },
            skip: (input.page - 1) * input.limit,
            take: input.limit,
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

    updateStepOwn: permissionProcedure
        .input(ExerciseStepSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exerciseStep.update({
                where: { id: input.id, authorId: ctx.session.user.id },
                data: input,
            });
        }),

    updateStepAny: permissionProcedure
        .input(ExerciseStepSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exerciseStep.update({
                where: { id: input.id },
                data: input,
            });
        }),

    deleteOwn: permissionProcedure
        .input(CUIDSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exercise.delete({
                where: { id: input, authorId: ctx.session.user.id },
            });
        }),

    deleteAny: permissionProcedure
        .input(CUIDSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exercise.delete({ where: { id: input } });
        }),

    deleteStepOwn: permissionProcedure
        .input(CUIDSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exerciseStep.delete({
                where: {
                    id: input,
                    authorId: ctx.session.user.id,
                },
            });
        }),

    deleteStepAny: permissionProcedure
        .input(CUIDSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.exerciseStep.delete({
                where: { id: input },
            });
        }),
});
