import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from '~/server/api/trpc';
import {
    CUIDObjectSchema,
    PageSchema,
    PostSchema,
    PostUpdateSchema,
} from '~/utils/schemas';

export const postRouter = createTRPCRouter({
    get: publicProcedure.input(PageSchema).query(async ({ input, ctx }) => {
        return ctx.db.post.findMany({
            orderBy: { createdAt: 'desc' },
            skip: (input.page - 1) * input.limit,
            take: input.limit,
            include: {
                author: {
                    select: { name: true },
                },
            },
        });
    }),

    create: protectedProcedure
        .input(PostSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.post.create({
                data: {
                    ...input,
                    tags: {
                        connectOrCreate: input.tags.map((tag) => ({
                            where: { title: tag },
                            create: { title: tag },
                        })),
                    },
                    author: {
                        connect: { id: ctx.session.user.id },
                    },
                },
            });
        }),

    update: protectedProcedure
        .input(PostUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.post.update({
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
                },
            });
        }),

    delete: protectedProcedure
        .input(CUIDObjectSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.post.delete({ where: { ...input } });
        }),
});
