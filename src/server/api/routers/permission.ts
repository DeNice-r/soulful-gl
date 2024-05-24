import { createTRPCRouter, spaProcedure } from '~/server/api/trpc';
import {
    MultiPermissionRoleSchema,
    MultiPermissionUserSchema,
    SinglePermissionRoleSchema,
    SinglePermissionUserSchema,
} from '~/utils/schemas';

export const permissionRouter = createTRPCRouter({
    list: spaProcedure
        // .input(SearchSchema)
        .query(
            async ({
                ctx,
                // input: { query }
            }) => {
                return ctx.db.permission
                    .findMany
                    // {
                    // where: {
                    //     ...(query && {
                    //         title: {
                    //             contains: query,
                    //             mode: 'insensitive',
                    //         },
                    //     }),
                    //     users: {
                    //         some: {
                    //             id: ctx.session.user.id,
                    //         },
                    //     },
                    // },
                    // }
                    ();
            },
        ),

    setForUser: spaProcedure
        .input(MultiPermissionUserSchema)
        .mutation(async ({ ctx, input: { entityId, titles } }) => {
            return ctx.db.user.update(getSetArgs(entityId, titles));
        }),

    setForRole: spaProcedure
        .input(MultiPermissionRoleSchema)
        .mutation(async ({ ctx, input: { entityId, titles } }) => {
            return ctx.db.role.update(getSetArgs(entityId, titles));
        }),

    addToUser: spaProcedure
        .input(SinglePermissionUserSchema)
        .mutation(async ({ ctx, input: { entityId, title } }) => {
            return ctx.db.user.update(getAddArgs(entityId, title));
        }),

    addToRole: spaProcedure
        .input(SinglePermissionRoleSchema)
        .mutation(async ({ ctx, input: { entityId, title } }) => {
            return ctx.db.role.update(getAddArgs(entityId, title));
        }),

    removeFromUser: spaProcedure
        .input(SinglePermissionUserSchema)
        .mutation(async ({ ctx, input: { entityId, title } }) => {
            return ctx.db.user.update(getRemoveArgs(entityId, title));
        }),

    removeFromRole: spaProcedure
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
