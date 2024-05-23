import { z } from '~/utils/zod';
import {
    BackgroundPattern,
    LiqpayPeriodicity,
    Order,
    PaymentAction,
    PaymentCurrency,
    PaymentLanguage,
} from '~/utils/types';
import { MAX_ASSET_LIMIT } from '~/utils/constants';
import { env } from '~/env';

const FirstPage = 1;
const DefaultLimit = 10;
const PaginationDefault = { page: FirstPage, limit: DefaultLimit };

const NoDefaultPageSearchSchema = z.object({
    page: z.number().min(1).default(FirstPage),
    limit: z.number().min(1).max(MAX_ASSET_LIMIT).default(DefaultLimit),
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

export const ShortStringSchema = z.string().min(1).max(200);
export const MessageTextSchema = z.string().min(1).max(4096);

export const BusynessSchema = z.number().int().min(0).max(4);

export const TitleSchema = z.string().min(1).max(200);
export const QuerySchema = z.string().min(1).max(200);
export const RichTextSchema = z.string().max(15000);

export const MaybeStringifiedNumberSchema = z.union([
    z
        .string()
        .transform((value) => {
            return Number(value);
        })
        .refine((value) => !isNaN(value)),
    z.number(),
]);
export const AnyToStringSchema = z
    .union([z.string(), z.number()])
    .transform((value) => String(value));

export const LiqpayAPIVersionSchema = z.number().int().min(1).max(3).default(3);
export const LiqpayAmountSchema = z
    .number()
    .int()
    .min(1)
    .max(10000)
    .default(20);

export const CNBSchema = z.object({
    public_key: z
        .string()
        .refine((value) => value === env.NEXT_PUBLIC_LIQPAY_PUBLIC_KEY)
        .default(env.NEXT_PUBLIC_LIQPAY_PUBLIC_KEY),
    version: MaybeStringifiedNumberSchema.default(3).refine((value) => {
        const r = LiqpayAPIVersionSchema.safeParse(value);
        return r.success;
    }),
    amount: MaybeStringifiedNumberSchema.default(20).refine((value) => {
        const r = LiqpayAmountSchema.safeParse(value);
        return r.success;
    }),
    currency: z.nativeEnum(PaymentCurrency).default(PaymentCurrency.UAH),
    description: ShortStringSchema.default('Пожертва команді Soulful'),
    language: z.nativeEnum(PaymentLanguage).default(PaymentLanguage.UK),

    action: z.nativeEnum(PaymentAction).default(PaymentAction.PAYDONATE),
    subscribe_periodicity: z
        .nativeEnum(LiqpayPeriodicity)
        .default(LiqpayPeriodicity.MONTH),
    subscribe_date_start: z.string().default('2024-01-01 00:00:00'),
});

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

export const SetBooleanNumberIdSchema = z.object({
    id: NumberIdSchema,

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

export const CountSchema = z.number().min(1).max(MAX_ASSET_LIMIT).default(4);

export const PostSchema = TDISchema.extend({
    tags: z.array(z.string()).min(1).max(25).default([]).optional(),
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

export const UserQandASchema = z.object({
    question: ShortStringSchema,

    authorEmail: z.string().email(),
    authorName: ShortStringSchema,
});

export const FullQandASchema = UserQandASchema.extend({
    answer: ShortStringSchema.optional(),
});

export const AdminQandASchema = z.object({
    question: ShortStringSchema,
    answer: ShortStringSchema,
});

export const QandAUdateSchema = z.object({
    id: NumberIdSchema,

    question: RichTextSchema.optional(),
    answer: RichTextSchema.optional(),

    published: z.boolean().optional(),
});

export const DocumentSchema = TDISchema.extend({
    parentId: CUIDSchema.nullable().optional(),

    tags: z.array(z.string()).max(25).default([]),
});

export const DocumentUpdateSchema = TDIUpdateSchema.extend({
    id: z.string().cuid(),

    parentId: CUIDSchema.nullable().optional(),

    tags: z.array(z.string()).min(1).max(25).optional(),
});

export const DocumentFolderSchema = z.object({
    parentId: CUIDSchema.nullable().optional(),

    title: ShortStringSchema,

    tags: z.array(z.string()).max(25).default([]),
});

export const DocumentFolderUpdateSchema = z.object({
    id: CUIDSchema,

    title: ShortStringSchema.optional(),

    parentId: CUIDSchema.nullable().optional(),

    tags: z.array(z.string()).min(1).max(25).optional(),
});

export const MessageSchema = z.object({
    text: MessageTextSchema,
});
