import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { type Session } from 'next-auth';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { getServerSession } from '~/utils/auth';
import { db } from '~/server/db';
import { isPermitted } from '~/utils/authAssertions';
import { AccessType, type Meta } from '~/utils/types';

interface CreateContextOptions {
    session: Session | null;
    entity: string;
    action: string;
    isFullAccess?: boolean;
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        db,
        entity: opts.entity,
        action: opts.action,
    };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
    const { req, res } = opts;

    // Get the session from the server using the getServerSession wrapper function
    const session = await getServerSession(req, res);

    if (!req.query.trpc || !(typeof req.query.trpc === 'string')) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
                'Invalid tRPC query (I thought it was impossible to get here)',
        });
    }

    const [entity, action] = req.query.trpc.split('.').slice(0, 2);

    if (session) {
        return createInnerTRPCContext({
            session: {
                ...session,
            },
            entity,
            action,
        });
    }

    return createInnerTRPCContext({
        session,
        entity,
        action,
    });
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC
    .context<typeof createTRPCContext>()
    .meta<Meta>()
    .create({
        transformer: superjson,
        errorFormatter({ shape, error }) {
            return {
                ...shape,
                data: {
                    ...shape.data,
                    zodError:
                        error.cause instanceof ZodError
                            ? error.cause.flatten()
                            : null,
                },
            };
        },
        defaultMeta: {
            hasPermissionProtection: false,
        },
    });

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
//     .use(({ ctx, next }) => {  // todo: this is how it should be, but it breaks the app. P.S. it is just for type safety, so nothing critical
//     return next({
//         ctx: {
//             session: null,
//         },
//     });
// });

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            session: { ...ctx.session },
        },
    });
});

export const permissionProcedure = protectedProcedure
    .use(({ ctx, next }) => {
        const accessType = isPermitted(
            ctx.session.user.permissions,
            ctx.entity,
            ctx.action,
        );
        if (accessType === AccessType.NONE) {
            throw new TRPCError({ code: 'UNAUTHORIZED' });
        }
        return next({
            ctx: {
                isFullAccess: accessType === AccessType.ALL,
            },
        });
    })
    .meta({
        hasPermissionProtection: true,
    });

// Single permission access
export const spaProcedure = permissionProcedure.meta({
    hasSpaProtection: true,
});
