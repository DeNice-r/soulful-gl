import { createTRPCRouter, permissionProcedure } from '~/server/api/trpc';
import {
    CreateUserSchema,
    CUIDSchema,
    PageSchema,
    SetNotesSchema,
    SetSuspendedSchema,
    UpdateUserSchema,
} from '~/utils/schemas';

export const userRouter = createTRPCRouter({
    list: permissionProcedure
        .input(PageSchema)
        .query(async ({ input, ctx }) => {
            const [count, values] = await ctx.db.$transaction([
                ctx.db.user.count(),
                ctx.db.user.findMany({
                    select: getProjection(ctx.isFullAccess),
                    orderBy: { createdAt: 'desc' },
                    skip: (input.page - 1) * input.limit,
                    take: input.limit,
                }),
            ]);

            return {
                count,
                values,
            };
        }),

    // todo: get users with permission to chat

    getById: permissionProcedure
        .input(CUIDSchema)
        .query(async ({ input, ctx }) => {
            return ctx.db.user.findUnique({
                where: {
                    id: input,
                },
                select: getProjection(ctx.isFullAccess),
            });
        }),

    create: permissionProcedure
        .input(CreateUserSchema)
        .mutation(async ({ ctx, input: data }) => {
            return ctx.db.user.create({
                data,
            });
        }),

    setNotes: permissionProcedure
        .input(SetNotesSchema)
        .mutation(async ({ ctx, input: { id, notes } }) => {
            return ctx.db.user.update({
                where: {
                    id,
                },
                data: {
                    notes,
                },
            });
        }),

    update: permissionProcedure
        .input(UpdateUserSchema)
        .mutation(async ({ ctx, input: { id, ...data } }) => {
            return ctx.db.user.update({
                where: {
                    id,
                    ...(!ctx.isFullAccess && { id: ctx.session.user.id }),
                },
                data,
            });
        }),

    suspend: permissionProcedure
        .input(SetSuspendedSchema)
        .mutation(async ({ ctx, input: { id, value } }) => {
            // todo: archive all user's chats if any upon suspension
            if (ctx.session.user.id === id) {
                throw new Error('Неможливо змінити статус власного запису');
            }
            return ctx.db.user.update({
                where: {
                    id,
                    ...(!ctx.isFullAccess && { id: ctx.session.user.id }),
                },
                data: {
                    suspended: value,
                },
            });
        }),

    delete: permissionProcedure
        .input(CUIDSchema)
        .mutation(async ({ ctx, input: id }) => {
            return ctx.db.post.delete({
                where: {
                    id,
                    ...(!ctx.isFullAccess && { authorId: ctx.session.user.id }),
                },
            });
        }),
});

function getProjection(isFullAccess: boolean) {
    return {
        id: true,
        email: true,
        name: true,
        image: true,
        description: true,
        notes: isFullAccess,
        createdAt: true,
        updatedAt: true,
        suspended: isFullAccess,
    };
}
