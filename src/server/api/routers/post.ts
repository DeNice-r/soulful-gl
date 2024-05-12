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
    SetBooleanSchema,
} from '~/utils/schemas';
import { isPermitted } from '~/utils/authAssertions';
import { AccessType, SearchablePostFields } from '~/utils/types';

export const postRouter = createTRPCRouter({
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
                        ...Object.values(SearchablePostFields).map((field) => ({
                            [field]: contains,
                        })),

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
                    ctx.db.post.count({
                        ...(query && {
                            where: containsQuery,
                        }),
                    }),
                    ctx.db.post.findMany({
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

                    ...(ctx?.session?.user?.id && {
                        author: {
                            connect: { id: ctx.session.user.id },
                        },
                    }),
                },
            });
        }),

    update: permissionProcedure
        .input(PostUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const { tags, ...noTagsInput } = input;

            return ctx.db.post.update({
                where: {
                    id: input.id,
                    ...(!ctx.isFullAccess && { authorId: ctx.session.user.id }),
                },
                data: {
                    ...noTagsInput,
                    ...(tags && {
                        tags: {
                            connectOrCreate: tags.map((tag) => ({
                                where: { title: tag },
                                create: { title: tag },
                            })),
                        },
                    }),
                },
            });
        }),

    publish: permissionProcedure
        .input(SetBooleanSchema)
        .mutation(async ({ ctx, input: { id, value } }) => {
            return ctx.db.post.update({
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
            return ctx.db.post.delete({
                where: {
                    id: input,
                    ...(!ctx.isFullAccess && { authorId: ctx.session.user.id }),
                },
            });
        }),
});
