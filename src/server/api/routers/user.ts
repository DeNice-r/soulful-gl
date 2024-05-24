import {
    createTRPCRouter,
    multilevelPermissionProcedure,
    permissionProcedure,
    protectedProcedure,
    publicMultilevelPermissionProcedure,
} from '~/server/api/trpc';
import {
    CreateUserSchema,
    SearchUsersSchema,
    SetNotesSchema,
    SetBooleanSchema,
    StringIdSchema,
    UpdateUserSchema,
    ChangePasswordSchema,
    SelfUpdateUserSchema,
} from '~/utils/schemas';
import { archiveChat } from '~/server/api/routers/common';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { env } from '~/env';
import {
    sendChangeEmailEmail,
    sendPasswordUpdateEmail,
    sendRegEmail,
} from '~/utils/email/templates';
import { AccessType, SearchableUserFields } from '~/utils/types';
import { getAccessType } from '~/utils/auth';

export const userRouter = createTRPCRouter({
    list: multilevelPermissionProcedure
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

    get: publicMultilevelPermissionProcedure
        .input(StringIdSchema.optional())
        .query(async ({ input, ctx }) => {
            const accessType = getAccessType(ctx);
            if (
                input !== ctx.session?.user?.id &&
                accessType === AccessType.NONE
            ) {
                throw new Error('Access denied');
            }

            const id = input || ctx.session?.user?.id;

            if (!id) {
                throw new Error('User not found');
            }

            return ctx.db.user.findUnique({
                where: {
                    id,
                },
                select: getProjection(accessType === AccessType.ALL),
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
            const password = randomUUID();

            const user = await ctx.db.user.create({
                data: {
                    ...data,
                    password: await bcrypt.hash(password, env.SALT_ROUNDS),
                    isOauth: false,
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

    selfUpdate: protectedProcedure
        .input(SelfUpdateUserSchema)
        .mutation(async ({ ctx, input: data }) => {
            return ctx.db.user.update({
                where: {
                    id: ctx.session.user.id,
                },
                data,
            });
        }),

    update: permissionProcedure
        .input(UpdateUserSchema)
        .mutation(async ({ ctx, input: { id, ...data } }) => {
            const user = await ctx.db.user.findUnique({
                where: {
                    id,
                },
                select: {
                    isOauth: true,
                    name: true,
                    email: true,
                },
            });

            if (!user) {
                throw new Error('Користувач не знайдений');
            }

            if (data.email && user.email && data.email !== user.email) {
                if (user.isOauth) {
                    throw new Error(
                        'Неможливо змінити адресу електронної пошти для OAuth користувача',
                    );
                }

                await sendChangeEmailEmail(
                    user.name ?? 'Анонім',
                    user.email,
                    data.email,
                );
            }

            return ctx.db.user.update({
                where: {
                    id,
                },
                data,
            });
        }),

    resetPassword: permissionProcedure
        .input(StringIdSchema)
        .mutation(async ({ ctx, input: id }) => {
            const checkUser = await ctx.db.user.findUnique({
                where: {
                    id,
                },
                select: {
                    password: true,
                },
            });

            if (!checkUser || !checkUser.password) {
                throw new Error('Користувач не використовує пароль для входу');
            }

            const password = randomUUID();

            const user = await ctx.db.user.update({
                where: {
                    id,
                },
                data: {
                    password: await bcrypt.hash(password, env.SALT_ROUNDS),
                },
            });

            if (!user || !user.email) {
                throw new Error('Користувач не має електронної пошти');
            }

            await sendPasswordUpdateEmail(
                user.email,
                user.name ?? 'Анонім',
                password,
                ctx.host,
            );

            return true;
        }),

    changePassword: protectedProcedure
        .input(ChangePasswordSchema)
        .mutation(async ({ ctx, input: { oldPassword, newPassword } }) => {
            const checkUser = await ctx.db.user.findUnique({
                where: {
                    id: ctx.session.user.id,
                    isOauth: false,
                },
                select: {
                    password: true,
                    email: true,
                },
            });

            if (!checkUser || !checkUser.password || !checkUser.email) {
                throw new Error('Користувач не використовує пароль для входу');
            }

            if (!(await bcrypt.compare(oldPassword, checkUser.password))) {
                throw new Error('Неправильний старий пароль');
            }

            const user = await ctx.db.user.update({
                where: {
                    id: ctx.session.user.id,
                    isOauth: false,
                },
                data: {
                    password: await bcrypt.hash(newPassword, env.SALT_ROUNDS),
                },
            });

            await sendPasswordUpdateEmail(
                user.email!, // checked above
                user.name ?? 'Анонім',
                newPassword,
                ctx.host,
            );
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
        isOauth: true,
        notes: isFullAccess,
        createdAt: true,
        updatedAt: true,
        reportCount: true,
        suspended: isFullAccess,
    };
}
