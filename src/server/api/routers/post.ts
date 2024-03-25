import {
    adminProcedure,
    createTRPCRouter,
    personnelProcedure,
    publicProcedure,
} from '~/server/api/trpc';
import {
    CUIDSchema,
    PageSchema,
    PostSchema,
    PostUpdateSchema,
} from '~/utils/schemas';
import type { z } from 'zod';
import { isAtLeast } from '~/utils/frontend/auth';
import { UserRole } from '~/utils/types';

function getUpdateData(input: z.infer<typeof PostUpdateSchema>) {
    return {
        title: input.title,
        description: input.description,
        image: input.image,

        published: input.published,

        ...(input.tags && {
            tags: {
                connectOrCreate: input.tags.map((tag) => ({
                    where: { title: tag },
                    create: { title: tag },
                })),
            },
        }),
    };
}

export const postRouter = createTRPCRouter({
    get: publicProcedure.input(PageSchema).query(async ({ input, ctx }) => {
        return ctx.db.post.findMany({
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
        const post = await ctx.db.post.findUnique({
            where: { id: input },
            include: {
                author: {
                    select: { name: true },
                },
            },
        });

        if (!post) return null;

        if (
            post.published ||
            (ctx.session &&
                (ctx.session.user.id === post.authorId ||
                    isAtLeast(ctx?.session.user?.role, UserRole.ADMIN)))
        )
            return post;

        return null;
    }),

    getMyUnpublished: personnelProcedure
        .input(PageSchema)
        .query(async ({ input, ctx }) => {
            return ctx.db.post.findMany({
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

    getUnpublished: adminProcedure
        .input(PageSchema)
        .query(async ({ input, ctx }) => {
            return ctx.db.post.findMany({
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

    create: personnelProcedure
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

    updateMy: personnelProcedure
        .input(PostUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.post.update({
                where: { id: input.id, authorId: ctx.session.user.id },
                data: getUpdateData(input),
            });
        }),

    update: adminProcedure
        .input(PostUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.post.update({
                where: { id: input.id },
                data: getUpdateData(input),
            });
        }),

    deleteMy: personnelProcedure
        .input(CUIDSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.post.delete({
                where: { id: input, authorId: ctx.session.user.id },
            });
        }),

    delete: adminProcedure
        .input(CUIDSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.post.delete({ where: { id: input } });
        }),
});
