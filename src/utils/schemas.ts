import { z } from '~/utils/zod';
import { BackgroundPattern, Order, SortableUserFields } from '~/utils/types';
import { env } from '~/env';

const FirstPage = 1;
const DefaultLimit = 10;
const PaginationDefault = { page: FirstPage, limit: DefaultLimit };

const NoDefaultPageSearchSchema = z.object({
    page: z.number().min(1).default(FirstPage),
    limit: z.number().min(1).max(100).default(DefaultLimit),
    query: z.string().optional(),
    orderBy: z.string().optional(),
    order: z.nativeEnum(Order).optional(),
});
export const PageSchema = NoDefaultPageSearchSchema.default(PaginationDefault);
export const SearchUsersSchema = NoDefaultPageSearchSchema.extend({
    permissions: z.array(z.string()).optional(),
}).default(PaginationDefault);

export const NumberIdSchema = z.number().int().nonnegative();
export const StringIdSchema = z.string().min(1).max(100);
export const CUIDSchema = z.string().cuid();
export const CUIDObjectSchema = z.object({ id: CUIDSchema });
export const EmailSchema = z.string().email();

export const ShortStringSchema = z.string().min(1).max(100);
export const MessageTextSchema = z.string().min(1).max(4096);

export const BusynessSchema = z.number().int().min(0).max(4);

export const TitleSchema = z.string().min(1).max(200);
export const QuerySchema = z.string().min(1).max(200);
export const RichTextSchema = z.string().max(15000);

// const ImageBucketRegex = new RegExp(
//     `https://${env.NEXT_PUBLIC_AWS_S3_BUCKET}\\.s3(?:\\.${env.NEXT_PUBLIC_AWS_REGION})?\\.amazonaws\\.com/.+`,
// );
export const ImageSchema = z.string();
// .refine((value) => ImageBucketRegex.test(value));

export const SearchSchema = NoDefaultPageSearchSchema.extend({
    query: QuerySchema.optional(),

    published: z.boolean().optional(),
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
    email: z.union([EmailSchema, z.string().length(0)]),
    name: ShortStringSchema,
    image: ImageSchema.optional(),
    description: RichTextSchema.optional(),
    notes: z.string().optional(),
});

export const UpdateUserSchema = z.object({
    id: StringIdSchema,

    name: ShortStringSchema.optional(),
    image: ImageSchema.optional(),
    description: RichTextSchema.optional(),
    notes: z.string().optional(),
});

export const SetBooleanSchema = z.object({
    id: z.string(),

    value: z.boolean(),
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
    title: z.string().min(3).max(100),
    description: z.string().min(3).max(250),
    published: z.boolean().optional().default(false),
});

export const RecommendationUpdateSchema = TDIUpdateSchema.extend({
    id: z.string().cuid(),

    published: z.boolean().optional(),
});

export const PostSchema = TDISchema.extend({
    tags: z.array(z.string()).min(1).max(25).optional().default([]),
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

export const QandASchema = z.object({
    question: RichTextSchema,

    authorEmail: z.string().email(),
    authorName: ShortStringSchema,
});

export const QandAUdateSchema = z.object({
    id: NumberIdSchema,

    question: RichTextSchema.optional(),
    answer: RichTextSchema.optional(),

    published: z.boolean().optional(),
});

export const DocumentSchema = TDISchema.extend({
    folderId: CUIDSchema.optional(),

    tags: z.array(z.string()).min(1).max(25).default([]),
});

export const DocumentUpdateSchema = TDIUpdateSchema.extend({
    id: z.string().cuid(),

    folderId: CUIDSchema.optional(),

    tags: z.array(z.string()).min(1).max(25).optional(),
});

export const DocumentFolderSchema = z.object({
    parentId: CUIDSchema.optional(),

    title: ShortStringSchema,

    tags: z.array(z.string()).min(1).max(25).default([]),
});

export const DocumentFolderUpdateSchema = z.object({
    id: CUIDSchema,

    title: ShortStringSchema.optional(),

    parentId: CUIDSchema.optional(),

    tags: z.array(z.string()).min(1).max(25).optional(),
});

export const MessageSchema = z.object({
    text: MessageTextSchema,
});
