import { createTRPCRouter, permissionProcedure } from '~/server/api/trpc';
import {
    MultiPermissionRoleSchema,
    MultiPermissionUserSchema,
    SearchSchema,
    SinglePermissionRoleSchema,
    SinglePermissionUserSchema,
} from '~/utils/schemas';

export const permissionRouter = createTRPCRouter({
    list: permissionProcedure
        .input(SearchSchema)
        .query(async ({ ctx, input: { query } }) => {
            return ctx.db.permission.findMany({
                where: {
                    ...(query && {
                        title: {
                            contains: query,
                            mode: 'insensitive',
                        },
                    }),
                    users: {
                        some: {
                            id: ctx.session.user.id,
                        },
                    },
                },
            });
        }),

    setForUser: permissionProcedure
        .input(MultiPermissionUserSchema)
        .mutation(async ({ ctx, input: { entityId, titles } }) => {
            return ctx.db.user.update(getSetArgs(entityId, titles));
        }),

    setForRole: permissionProcedure
        .input(MultiPermissionRoleSchema)
        .mutation(async ({ ctx, input: { entityId, titles } }) => {
            return ctx.db.role.update(getSetArgs(entityId, titles));
        }),

    addToUser: permissionProcedure
        .input(SinglePermissionUserSchema)
        .mutation(async ({ ctx, input: { entityId, title } }) => {
            return ctx.db.user.update(getAddArgs(entityId, title));
        }),

    addToRole: permissionProcedure
        .input(SinglePermissionRoleSchema)
        .mutation(async ({ ctx, input: { entityId, title } }) => {
            return ctx.db.role.update(getAddArgs(entityId, title));
        }),

    removeFromUser: permissionProcedure
        .input(SinglePermissionUserSchema)
        .mutation(async ({ ctx, input: { entityId, title } }) => {
            return ctx.db.user.update(getRemoveArgs(entityId, title));
        }),

    removeFromRole: permissionProcedure
        .input(SinglePermissionRoleSchema)
        .mutation(async ({ ctx, input: { entityId, title } }) => {
            return ctx.db.role.update(getRemoveArgs(entityId, title));
        }),
});

function getSetArgs<EntityIdType extends number | string>(
    entityId: EntityIdType,
    titles: string[],
) {
    return {
        where: {
            id: entityId,
        },
        data: {
            permissions: {
                set: titles.map((title) => ({
                    title,
                })),
            },
        },
    };
}

function getAddArgs<EntityIdType extends number | string>(
    entityId: EntityIdType,
    title: string,
) {
    return {
        where: {
            id: entityId,
        },
        data: {
            permissions: {
                connect: {
                    title,
                },
            },
        },
    };
}

function getRemoveArgs<EntityIdType extends number | string>(
    entityId: EntityIdType,
    title: string,
) {
    return {
        where: {
            id: entityId,
        },
        data: {
            permissions: {
                disconnect: {
                    title,
                },
            },
        },
    };
}
