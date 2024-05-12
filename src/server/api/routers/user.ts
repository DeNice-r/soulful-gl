import {
    createTRPCRouter,
    permissionProcedure,
    protectedProcedure,
} from '~/server/api/trpc';
import {
    CreateUserSchema,
    SearchUsersSchema,
    SetNotesSchema,
    SetBooleanSchema,
    StringIdSchema,
    UpdateUserSchema,
} from '~/utils/schemas';
import { archiveChat } from '~/server/api/routers/common';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { env } from '~/env';
import { sendRegEmail } from '~/utils/email';
import { SearchableUserFields } from '~/utils/types';

export const userRouter = createTRPCRouter({
    list: permissionProcedure
        .input(SearchUsersSchema)
        .query(
            async ({
                input: { page, limit, query, orderBy, order, permissions },
                ctx,
            }) => {
                const p = ['*:*', '*:*:*'];
                for (const permission of permissions || []) {
                    p.push(permission);
                    p.push(`${permission}:*`);
                }

                let where: Record<string, object> | undefined = permissions && {
                    permissions: {
                        some: {
                            title: {
                                in: p,
                            },
                        },
                    },
                    roles: {
                        some: {
                            permissions: {
                                some: {
                                    title: {
                                        in: p,
                                    },
                                },
                            },
                        },
                    },
                };

                const contains = {
                    contains: query,
                    mode: 'insensitive',
                };

                const containsQuery = {
                    OR: Object.values(SearchableUserFields).map((field) => ({
                        [field]: contains,
                    })),
                };

                if (query) {
                    where
                        ? (where = {
                              AND: [where, containsQuery],
                          })
                        : (where = containsQuery);
                }

                const [count, values] = await ctx.db.$transaction([
                    ctx.db.user.count({ where }),
                    ctx.db.user.findMany({
                        where,
                        select: getProjection(ctx.isFullAccess),
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

    get: permissionProcedure
        .input(StringIdSchema)
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
            if (!data.email) {
                throw new Error('Email is required');
            }

            const password = randomUUID();

            const user = await ctx.db.user.create({
                data: {
                    ...data,
                    password: await bcrypt.hash(password, env.SALT_ROUNDS),
                },
            });

            await sendRegEmail(data.email, data.name, password, ctx.host);

            return user;
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
        .input(SetBooleanSchema)
        .mutation(async ({ ctx, input: { id, value } }) => {
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
        reportCount: true,
        suspended: isFullAccess,
    };
}
