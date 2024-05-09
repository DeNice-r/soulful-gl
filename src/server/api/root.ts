import { postRouter } from '~/server/api/routers/post';
import { exerciseRouter } from '~/server/api/routers/exercise';
import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc';
import { recommendationRouter } from '~/server/api/routers/recommendation';
import { userRouter } from '~/server/api/routers/user';
import { permissionRouter } from '~/server/api/routers/permission';
import { documentRouter } from '~/server/api/routers/document';
import { documentFolderRouter } from '~/server/api/routers/documentFolder';
import { qandaRouter } from '~/server/api/routers/qanda';
import { chatRouter } from '~/server/api/routers/chat';
import { statsRouter } from '~/server/api/routers/stats';

export const appRouter = createTRPCRouter({
    // Admin-related routers
    stats: statsRouter,
    user: userRouter,
    permission: permissionRouter,

    // Chat-related routers
    chat: chatRouter,

    // Content-related routers
    recommendation: recommendationRouter,
    post: postRouter,
    exercise: exerciseRouter,
    qanda: qandaRouter,

    // Private content-related routers
    documentFolder: documentFolderRouter,
    document: documentRouter,
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
