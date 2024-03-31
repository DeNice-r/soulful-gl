import { postRouter } from '~/server/api/routers/post';
import { exerciseRouter } from '~/server/api/routers/exercise';
import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { recommendationRouter } from '~/server/api/routers/recommendation';
import { userRouter } from '~/server/api/routers/user';
import { permissionRouter } from '~/server/api/routers/permission';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    // Admin-related routers
    user: userRouter,
    permission: permissionRouter,

    // Content-related routers
    recommendation: recommendationRouter,
    post: postRouter,
    exercise: exerciseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
