import { createTRPCRouter, permissionProcedure } from '~/server/api/trpc';
import {
    CUIDSchema,
    DocumentFolderSchema,
    DocumentFolderUpdateSchema,
    ShortStringSchema,
} from '~/utils/schemas';
import { z } from '~/utils/zod';

export const documentFolderRouter = createTRPCRouter({
    list: permissionProcedure
        .input(
            z
                .object({
                    id: CUIDSchema.nullable().optional(),
                    query: ShortStringSchema.optional(),
                })
                .default({ id: null }),
        )
        .query(async ({ input: { id, query }, ctx }) => {
            const contains = {
                contains: query ?? '',
                mode: 'insensitive' as const,
            };

            if (id) {
                const x = await ctx.db.documentFolder.findUnique({
                    where: { id },
                    select: {
                        title: true,
                        parent: {
                            select: { id: true, title: true, parentId: true },
                        },
                        documents: query
                            ? {
                                  where: {
                                      OR: [
                                          {
                                              title: contains,
                                          },
                                          {
                                              description: contains,
                                          },
                                      ],
                                  },
                              }
                            : true,
                        folders: query
                            ? {
                                  where: {
                                      title: contains,
                                  },
                              }
                            : true,
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
                parentId: id ?? null,
            };

            const [folders, documents] = await Promise.all([
                ctx.db.documentFolder.findMany({ where }),
                ctx.db.document.findMany({
                    where: {
                        ...where,
                        ...(query && {
                            OR: [
                                { title: contains },
                                { description: contains },
                            ],
                        }),
                    },
                }),
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
