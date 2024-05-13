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
            const [folders, documents] = await Promise.all([
                ctx.db.documentFolder.findMany({
                    where: {
                        ...(input
                            ? { parent: { id: input } }
                            : { parent: null }),
                    },
                }),
                ctx.db.document.findMany({
                    where: {
                        ...(input
                            ? { folder: { id: input } }
                            : { folder: null }),
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
            const { tags, parentId, ...noAmbiguousInput } = input;
            return ctx.db.documentFolder.create({
                data: {
                    ...noAmbiguousInput,
                    ...(parentId && {
                        parent: {
                            connect: { id: parentId },
                        },
                    }),
                    tags: {
                        connectOrCreate: tags.map((tag) => ({
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
            const { tags, parentId, ...noAmbiguousInput } = input;

            return ctx.db.documentFolder.update({
                where: {
                    id: input.id,
                },
                data: {
                    ...noAmbiguousInput,
                    ...(parentId && {
                        parent: {
                            connect: { id: parentId },
                        },
                    }),
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
