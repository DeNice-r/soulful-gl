import { z } from 'zod';
import { BackgroundPattern } from '~/utils/types';
import { env } from '~/env';

const FirstPage = 1;
const DefaultLimit = 10;
export const PageSchema = z
    .object({
        page: z.number().min(1).default(FirstPage),
        limit: z.number().min(1).max(100).default(DefaultLimit),
    })
    .default({ page: FirstPage, limit: DefaultLimit });

export const CUIDSchema = z.string().cuid();
export const CUIDObjectSchema = z.object({ id: CUIDSchema });

export const TitleSchema = z.string().min(1).max(200);
export const RichTextSchema = z.string().min(1).max(15000);

const ImageBucketRegex = new RegExp(
    `https://${env.AWS_S3_BUCKET}\\.s3(?:\\.${env.AWS_REGION})?\\.amazonaws\\.com/.+`,
);
export const ImageSchema = z
    .string()
    .refine((value) => ImageBucketRegex.test(value));

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

export const PostSchema = TDISchema.extend({
    tags: z.array(z.string()).min(1).max(25),
    published: z.boolean(),
});

export const PostSearchSchema = z.object({
    query: z.string().min(1).max(200).optional(),
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
