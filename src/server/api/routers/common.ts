import { type Context } from '~/server/api/trpc';

export async function archiveChat(input: number, ctx: Context) {
    if (!ctx.session) return false;

    const chat = await ctx.db.chat.findUnique({
        where: {
            id: input,
            personnelId: ctx.session.user.id,
        },
        include: {
            messages: {
                select: {
                    text: true,
                    createdAt: true,
                    isFromUser: true,
                },
            },
        },
    });

    if (!chat) return false;

    await ctx.db.$transaction([
        ctx.db.archivedChat.create({
            data: {
                personnelId: chat.personnelId,
                userId: chat.userId,
                createdAt: chat.createdAt,
                messages: {
                    create: chat.messages,
                },
            },
        }),
        ctx.db.chat.delete({
            where: {
                id: input,
            },
            include: {
                messages: true,
            },
        }),
    ]);

    return true;
}
