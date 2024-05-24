import {
    createTRPCRouter,
    multilevelPermissionProcedure,
    permissionProcedure,
} from '~/server/api/trpc';
import {
    CUIDSchema,
    DocumentFolderSchema,
    DocumentFolderUpdateSchema,
} from '~/utils/schemas';

export const documentFolderRouter = createTRPCRouter({
    list: permissionProcedure
        .input(CUIDSchema.nullable().optional())
        .query(async ({ input, ctx }) => {
            if (input) {
                const x = await ctx.db.documentFolder.findUnique({
                    where: { id: input },
                    select: {
                        title: true,
                        parent: {
                            select: { id: true, title: true, parentId: true },
                        },
                        documents: true,
                        folders: true,
                    },
                });

                return {
                    documents: x?.documents ?? [],
                    folders: x?.folders ?? [],
                    parent: x?.parent,
                    title: x?.title,
                };
            }
            const where = {
                where: {
                    ...(input ? { parentId: input } : { parentId: null }),
                },
            };

            const [folders, documents] = await Promise.all([
                ctx.db.documentFolder.findMany(where),
                ctx.db.document.findMany(where),
            ]);
            return {
                documents,
                folders,
                parent: null,
                title: null,
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

    delete: multilevelPermissionProcedure
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
