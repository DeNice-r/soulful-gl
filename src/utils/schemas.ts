import { z } from 'zod';
import { BackgroundPattern } from '~/utils/types';
// import bcrypt from 'bcrypt';

const FirstPage = 1;
const DefaultLimit = 10;
export const PageSchema = z
    .object({
        page: z.number().min(1).default(FirstPage),
        limit: z.number().min(1).max(100).default(DefaultLimit),
    })
    .default({ page: FirstPage, limit: DefaultLimit });

export const NumberIdSchema = z.number().int().nonnegative();
export const CUIDSchema = z.string().cuid();
export const CUIDObjectSchema = z.object({ id: CUIDSchema });

export const ShortStringSchema = z.string().min(1).max(100);

// export const PasswordSchema = z
//     .string()
//     .min(8)
//     .max(100)
//     .transform((v) => bcrypt.hashSync(v, env.SALT_ROUNDS));

export const TitleSchema = z.string().min(1).max(200);
export const QuerySchema = z.string().min(1).max(200);
export const RichTextSchema = z.string().min(1).max(15000);

const ImageBucketRegex = new RegExp(
    `https://${env.AWS_S3_BUCKET}\\.s3(?:\\.${env.AWS_REGION})?\\.amazonaws\\.com/.+`,
);
export const ImageSchema = z
    .string()
    .refine((value) => ImageBucketRegex.test(value));

export const SearchSchema = z.object({
    query: QuerySchema,
});

export const TDISchema = z.object({
    title: TitleSchema,
    description: RichTextSchema,
    image: ImageSchema.optional(),
});
export const TDIUpdateSchema = z.object({
    title: TitleSchema.optional(),
    description: RichTextSchema.optional(),
    image: ImageSchema.optional(),
});

export const CreateUserSchema = z.object({
    email: z.string().email(),
    name: ShortStringSchema,
    image: ImageSchema,
    description: RichTextSchema.optional(),
    // password: PasswordSchema,
    notes: z.string().optional(),
});

export const UpdateUserSchema = z.object({
    id: CUIDSchema,

    name: ShortStringSchema.optional(),
    image: ImageSchema.optional(),
    description: RichTextSchema.optional(),
    // password: PasswordSchema.optional(),
});

export const SetNotesSchema = z.object({
    id: CUIDSchema,

    notes: z.string(),
});

export const SinglePermissionUserSchema = z.object({
    entityId: CUIDSchema,

    title: ShortStringSchema,
});
export const SinglePermissionRoleSchema = z.object({
    entityId: NumberIdSchema,

    title: ShortStringSchema,
});

export const MultiPermissionUserSchema = z.object({
    entityId: CUIDSchema,

    titles: ShortStringSchema.array(),
});
export const MultiPermissionRoleSchema = z.object({
    entityId: NumberIdSchema,

    titles: ShortStringSchema.array(),
});

export const RecommendationSchema = TDISchema.extend({
    published: z.boolean(),
});

export const RecommendationUpdateSchema = TDIUpdateSchema.extend({
    id: z.string().cuid(),

    published: z.boolean().optional(),
});

export const PostSchema = TDISchema.extend({
    tags: z.array(z.string()).min(1).max(25).default([]),
    published: z.boolean().default(false),
});

export const PostSearchSchema = z.object({
    query: QuerySchema,
    published: z.boolean().optional(),
});

export const PostUpdateSchema = TDIUpdateSchema.extend({
    id: z.string().cuid(),

    tags: z.array(z.string()).min(1).max(25).optional(),
    published: z.boolean().optional(),
});

export const ExerciseStepSchema = TDISchema.extend({
    id: z.string().cuid().optional(),
    backgroundPattern: z.nativeEnum(BackgroundPattern).optional(),
    timeSeconds: z.number().min(1).max(3600),
});

export const ExerciseStepUpdateSchema = TDIUpdateSchema.extend({
    id: z.string().cuid(),

    backgroundPattern: z.nativeEnum(BackgroundPattern).optional(),
    timeSeconds: z.number().min(1).max(3600).or(z.null()).optional(),
});

export const ExerciseSchema = TDISchema.extend({
    tags: z.array(z.string()).min(1).max(25),
    steps: z.array(ExerciseStepSchema).min(1).max(100),
});

export const ExerciseUpdateSchema = TDIUpdateSchema.extend({
    id: z.string().cuid(),

    tags: z.array(z.string()).min(1).max(25).optional(),
    steps: z.array(ExerciseStepSchema).min(1).max(100).optional(),
});
