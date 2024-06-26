import {
    createTRPCRouter,
    multilevelPermissionProcedure,
    permissionProcedure,
    publicMultilevelPermissionProcedure,
    publicMultilevelSpaProcedure,
} from '~/server/api/trpc';
import {
    CUIDSchema,
    PageSchema,
    PostSchema,
    PostUpdateSchema,
    SetBooleanSchema,
} from '~/utils/schemas';
import { SearchablePostFields } from '~/utils/types';
import { getFullAccessConstraintWithAuthor } from '~/utils/auth';

export const postRouter = createTRPCRouter({
    list: publicMultilevelPermissionProcedure
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

                const where: object = {
                    AND: [
                        query && containsQuery,
                        getFullAccessConstraintWithAuthor(ctx),
                    ].filter((x) => !!x),
                };

                const [count, values] = await ctx.db.$transaction([
                    ctx.db.post.count({ where }),
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

    get: publicMultilevelSpaProcedure
        .input(CUIDSchema)
        .query(async ({ input, ctx }) => {
            return ctx.db.post.findUnique({
                where: { id: input, ...getFullAccessConstraintWithAuthor(ctx) },
                include: {
                    author: {
                        select: { name: true },
                    },
                },
            });
        }),

    create: permissionProcedure
        .input(PostSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.post.create({
                data: {
                    ...input,
                    tags: {
                        connectOrCreate: (input.tags ?? []).map((tag) => ({
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

    update: multilevelPermissionProcedure
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

    publish: multilevelPermissionProcedure
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

    delete: multilevelPermissionProcedure
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
