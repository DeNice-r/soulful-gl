import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { requestWrapper } from '~/pages/api/auth/[...nextauth]';
import { isPermitted } from '~/utils/authAssertions';
import { AccessType } from '~/utils/types';
import { type createTRPCContext } from '~/server/api/trpc';

export async function getServerSession(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    return await unstable_getServerSession(...requestWrapper(req, res));
}

export function getIsFullAccess(
    ctx: Awaited<ReturnType<typeof createTRPCContext>>,
) {
    return !!(
        ctx.session &&
        isPermitted(ctx.session?.user?.permissions, ctx.entity, ctx.action) ===
            AccessType.ALL
    );
}

export function getFullAccessConstraintWithAuthor(
    ctx: Awaited<ReturnType<typeof createTRPCContext>>,
) {
    return (
        !getIsFullAccess(ctx) && {
            OR: [
                { published: true },
                ...(ctx?.session?.user?.id.length
                    ? [
                          {
                              authorId: ctx.session.user.id,
                          },
                      ]
                    : []),
            ],
        }
    );
}
