import { createEnv } from '@t3-oss/env-nextjs';
import validator from 'validator';
import { z } from 'zod';

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        NODE_ENV: z
            .enum(['development', 'test', 'production'])
            .default('development'),

        DATABASE_URL: z.string().url(),

        NEXTAUTH_URL: z.preprocess(
            // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
            // Since NextAuth.js automatically uses the VERCEL_URL if present.
            (str) => process.env.VERCEL_URL ?? str,
            // VERCEL_URL doesn't include `https` so it cant be validated as a URL
            process.env.VERCEL ? z.string() : z.string().url(),
        ),
        NEXTAUTH_SECRET: z.string(),
        SALT_ROUNDS: z
            .string()
            .transform((value) => Number(value))
            .refine((value) => !isNaN(value))
            .default('10'),

        GITHUB_ID: z.string().refine(validator.isHexadecimal),
        GITHUB_SECRET: z.string().refine(validator.isHexadecimal),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        NEXT_PUBLIC_WSS_ENDPOINT: z.string().url(),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,

        DATABASE_URL: process.env.DATABASE_URL,

        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        SALT_ROUNDS: process.env.SALT_ROUNDS,

        GITHUB_ID: process.env.GITHUB_ID,
        GITHUB_SECRET: process.env.GITHUB_SECRET,

        NEXT_PUBLIC_WSS_ENDPOINT: process.env.NEXT_PUBLIC_WSS_ENDPOINT,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
     * useful for Docker builds.
     */
    skipValidation: !process.env.CONDUCT_ENV_VALIDATION,
    /**
     * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
     * `SOME_VAR=''` will throw an error.
     */
    emptyStringAsUndefined: true,
});
