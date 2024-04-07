import { createTRPCRouter, permissionProcedure } from '~/server/api/trpc';
import {
    CUIDSchema,
    DocumentSchema,
    DocumentUpdateSchema,
    PageSchema,
} from '~/utils/schemas';

export const documentRouter = createTRPCRouter({
    list: permissionProcedure
        .input(PageSchema)
        .query(async ({ input, ctx }) => {
            return ctx.db.document.findMany({
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

    get: permissionProcedure.input(CUIDSchema).query(async ({ input, ctx }) => {
        return await ctx.db.document.findUnique({
            where: { id: input },
            include: {
                author: {
                    select: { name: true },
                },
            },
        });
    }),

    create: permissionProcedure
        .input(DocumentSchema)
        .mutation(async ({ ctx, input }) => {
            const { folderId, ...noFolderInput } = input;
            return ctx.db.document.create({
                data: {
                    ...noFolderInput,
                    ...(folderId && {
                        folder: {
                            connect: { id: folderId },
                        },
                    }),
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
        .input(DocumentUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const { tags, ...noTagsInput } = input;

            return ctx.db.document.update({
                where: {
                    id: input.id,
                    ...(!ctx.isFullAccess && { authorId: ctx.session.user.id }),
                },
                data: {
                    ...noTagsInput,
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

    delete: permissionProcedure
        .input(CUIDSchema)
        .mutation(async ({ ctx, input }) => {
            return ctx.db.document.delete({
                where: {
                    id: input,
                    ...(!ctx.isFullAccess && { authorId: ctx.session.user.id }),
                },
            });
        }),
});
