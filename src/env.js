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

        GOOGLE_ID: z.string(),
        GOOGLE_SECRET: z.string(),

        FACEBOOK_ID: z.string().refine(validator.isNumeric),
        FACEBOOK_SECRET: z.string().refine(validator.isHexadecimal),

        AWS_REGION: z.string(),
        AWS_ACCESS_KEY_ID: z.string(),
        AWS_SECRET_ACCESS_KEY: z.string(),

        AWS_SES_FROM_IDENTITY: z.string(),
        AWS_SES_USER: z.string(),
        AWS_SES_PASSWORD: z.string(),
        AWS_SES_HOST: z.string(),
        AWS_SES_PORT: z
            .string()
            .transform((value) => Number(value))
            .refine((value) => !isNaN(value)),

        AWS_S3_BUCKET: z.string(),

        LIQPAY_PRIVATE_KEY: z.string(),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        NEXT_PUBLIC_WSS_ENDPOINT: z.string().url(),
        NEXT_PUBLIC_AWS_S3_BUCKET: z.string(),
        NEXT_PUBLIC_AWS_REGION: z.string(),
        NEXT_PUBLIC_LIQPAY_PUBLIC_KEY: z.string(),
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

        GOOGLE_ID: process.env.GOOGLE_ID,
        GOOGLE_SECRET: process.env.GOOGLE_SECRET,

        FACEBOOK_ID: process.env.FACEBOOK_ID,
        FACEBOOK_SECRET: process.env.FACEBOOK_SECRET,

        AWS_REGION: process.env.AWS_REGION,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

        AWS_SES_FROM_IDENTITY: process.env.AWS_SES_FROM_IDENTITY,
        AWS_SES_USER: process.env.AWS_SES_USER,
        AWS_SES_PASSWORD: process.env.AWS_SES_PASSWORD,
        AWS_SES_HOST: process.env.AWS_SES_HOST,
        AWS_SES_PORT: process.env.AWS_SES_PORT,

        AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,

        LIQPAY_PRIVATE_KEY: process.env.LIQPAY_PRIVATE_KEY,

        NEXT_PUBLIC_WSS_ENDPOINT: process.env.NEXT_PUBLIC_WSS_ENDPOINT,
        NEXT_PUBLIC_AWS_S3_BUCKET: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
        NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
        NEXT_PUBLIC_LIQPAY_PUBLIC_KEY:
            process.env.NEXT_PUBLIC_LIQPAY_PUBLIC_KEY,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
     * useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    /**
     * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
     * `SOME_VAR=''` will throw an error.
     */
    emptyStringAsUndefined: true,
});
