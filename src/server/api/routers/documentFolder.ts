import { createTRPCRouter, permissionProcedure } from '~/server/api/trpc';
import {
    CUIDSchema,
    DocumentFolderSchema,
    DocumentFolderUpdateSchema,
} from '~/utils/schemas';

export const documentFolderRouter = createTRPCRouter({
    list: permissionProcedure
        .input(CUIDSchema.optional())
        .query(async ({ input, ctx }) => {
            if (input) {
                return ctx.db.documentFolder.findMany({
                    where: {
                        parentId: input,
                    },
                });
            }

            const [folders, documents] = await Promise.all([
                ctx.db.documentFolder.findMany({
                    where: {
                        parent: null,
                    },
                }),
                ctx.db.document.findMany({
                    where: {
                        folder: null,
                    },
                }),
            ]);

            return {
                documents,
                folders,
            };
        }),

    create: permissionProcedure
        .input(DocumentFolderSchema)
        .mutation(async ({ ctx, input }) => {
            const { tags, parentId, ...noAmbigousInput } = input;
            return ctx.db.documentFolder.create({
                data: {
                    ...noAmbigousInput,
                    ...(parentId && {
                        parent: {
                            connect: { id: parentId },
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
        .input(DocumentFolderUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const { tags, parentId, ...noAmbigousInput } = input;

            return ctx.db.documentFolder.update({
                where: {
                    id: input.id,
                },
                data: {
                    ...noAmbigousInput,
                    ...(parentId && {
                        parent: {
                            connect: { id: parentId },
                        },
                    }),
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
            return ctx.db.documentFolder.delete({
                where: {
                    id: input,
                    ...(!ctx.isFullAccess && { authorId: ctx.session.user.id }),
                },
            });
        }),
});
