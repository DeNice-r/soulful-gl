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
    host: string;
    isFullAccess?: boolean;
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        db,
        entity: opts.entity,
        action: opts.action,
        host: opts.host,
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
    const commonContext = {
        entity,
        action,
        host: req.headers.host ?? '',
    };

    if (session) {
        return createInnerTRPCContext({
            session: {
                ...session,
            },
            ...commonContext,
        });
    }

    return createInnerTRPCContext({
        session,
        ...commonContext,
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
