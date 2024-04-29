import {
    createTRPCRouter,
    permissionProcedure,
    protectedProcedure,
} from '~/server/api/trpc';
import {
    CreateUserSchema,
    CUIDSchema,
    PageSchema,
    SetNotesSchema,
    SetSuspendedSchema,
    StringIdSchema,
    UpdateUserSchema,
} from '~/utils/schemas';
import { archiveChat } from '~/server/api/routers/common';

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

    getAccessToken: protectedProcedure.query(async ({ ctx }) => {
        return (
            await ctx.db.session.findFirst({
                where: {
                    userId: ctx.session.user.id,
                    expires: {
                        gte: new Date(),
                    },
                },
                select: {
                    sessionToken: true,
                },
            })
        )?.sessionToken;
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

            const chatIds = await ctx.db.chat.findMany({
                where: {
                    OR: [
                        {
                            personnelId: id,
                        },
                        {
                            userId: id,
                        },
                    ],
                },
                select: {
                    id: true,
                },
            });

            const promises: Promise<boolean>[] = [];
            for (const chat of chatIds) {
                promises.push(archiveChat(chat.id, ctx));
            }

            await Promise.all(promises);

            return ctx.db.user.update({
                where: {
                    id,
                },
                data: {
                    suspended: value,
                },
            });
        }),

    delete: permissionProcedure
        .input(StringIdSchema)
        .mutation(async ({ ctx, input: id }) => {
            if (ctx.session.user.id === id) {
                throw new Error('Неможливо видалити власний запис');
            }

            return ctx.db.user.delete({
                where: {
                    id,
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
