import {
    createTRPCRouter,
    permissionProcedure,
    publicProcedure,
} from '~/server/api/trpc';
import {
    CUIDSchema,
    PageSchema,
    PostSchema,
    PostUpdateSchema,
} from '~/utils/schemas';
import type { z } from 'zod';
import { isPermitted } from '~/utils/authAssertions';
import { AccessType } from '~/utils/types';

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
                    isPermitted(
                        ctx.session?.user?.permissions,
                        ctx.entity,
                        ctx.action,
                    ) === AccessType.ALL))
        )
            return post;

        return null;
    }),

    getUnpublished: permissionProcedure
        .input(PageSchema)
        .query(async ({ input, ctx }) => {
            return ctx.db.post.findMany({
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

    update: permissionProcedure
        .input(PostUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.post.update({
                where: {
                    id: input.id,
                    ...(!ctx.isFullAccess && { authorId: ctx.session.user.id }),
                },
                data: getUpdateData(input),
            });
        }),

    delete: permissionProcedure
        .input(CUIDSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.post.delete({
                where: {
                    id: input,
                    ...(!ctx.isFullAccess && { authorId: ctx.session.user.id }),
                },
            });
        }),
});
