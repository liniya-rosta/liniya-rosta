import {z} from "zod";

const i18nString = z.object({
    ru: z.string().min(1, "Поле обязательно"),
});

const i18nStringOptional = z.object({
    ru: z.string(),
});

const characteristicSchema = z.object({
    key: i18nString,
    value: i18nString,
});

const saleSchema = z.object({
    isOnSale: z.boolean(),
    label: z.string().optional().nullable(),
});

const imageItemSchema = z.object({
    alt: i18nStringOptional.optional(),
    image: z.union([z.instanceof(File), z.null()])
        .refine((file) => file instanceof File && file.size > 0, {
            message: "Файл обязателен",
        }),
});

export const imagesSchema = z.object({
    image: z.instanceof(File, { message: "Файл обязателен" }).nullable().optional(),
    alt: i18nString.optional(),
});

export const createProductSchema = z.object({
    category: z.string().min(1, 'Категория обязательна'),
    title: z.object({
        ru: z.string().min(1, "Поле на русском обязательно").max(200, "Максимум 200 символов")
    }),
    description: i18nStringOptional.optional(),
    coverAlt: i18nStringOptional.optional().nullable(),
    cover: z
        .union([z.instanceof(File), z.null()])
        .refine((file) => file instanceof File && file.size > 0, {
            message: "Файл обязателен",
        }),
    images: z
        .array(imageItemSchema)
        .default([]),
    characteristics: z.array(characteristicSchema).optional(),
    sale: saleSchema.optional(),
    icon: z
        .union([z.instanceof(File), z.null(), z.undefined()])
        .optional()
        .refine((file) => !file || (file instanceof File && file.size > 0), {
            message: "Файл обязателен",
        }),
    iconAlt: i18nStringOptional.optional().nullable(),
    seoTitle: i18nStringOptional.optional(),
    seoDescription: i18nStringOptional.optional(),
});

export const updateProductSchema = z.object({
    category: z.string().min(1, 'Категория обязательна'),
    title: z.object({
        ru: z.string().min(1, "Поле на русском обязательно").max(200, "Максимум 200 символов")
    }),
    description: i18nStringOptional.optional(),
    coverAlt: i18nStringOptional.optional().nullable(),
    cover: z.union([z.instanceof(File), z.null(), z.undefined()]).optional(),
    iconAlt: i18nStringOptional.optional().nullable(),
    icon: z.union([z.instanceof(File), z.null(), z.undefined()]).optional(),
    characteristics: z.array(characteristicSchema).optional(),
    sale: saleSchema.optional(),
    seoTitle: i18nStringOptional.optional(),
    seoDescription: i18nStringOptional.optional(),
    images: z
        .array(imagesSchema)
        .optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;