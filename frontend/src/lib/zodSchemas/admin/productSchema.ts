import {z} from "zod";

const characteristicSchema = z.object({
    key: z.string().min(1, {message: "Ключ обязателен"}),
    value: z.string().min(1, {message: "Значение обязательно"}),
});

const saleSchema = z.object({
    isOnSale: z.boolean(),
    label: z.string().optional().nullable(),
});

const imageItemSchema = z.object({
    alt: z.string().optional(),
    url: z.union([z.instanceof(File), z.null()])
        .refine((file) => file instanceof File && file.size > 0, {
            message: "Файл обязателен",
        }),
});

export const imagesSchema = z.object({
    image: z.instanceof(File).nullable().optional(),
    alt: z.object({
        ru: z.string(),
    }).optional(),
});

export const createProductSchema = z.object({
    category: z.string().min(1, {message: "Категория обязательна"}),
    title: z.string().min(1, {message: "Название обязательно"}).max(200, {message: "Максимум 200 символов"}),
    description: z.string().optional(),
    coverAlt: z.string().optional().nullable(),
    cover: z
        .union([z.instanceof(File), z.null()])
        .refine((file) => file instanceof File && file.size > 0, {
            message: "Файл обязателен",
        }),
    images: z
        .array(imageItemSchema)
        .min(1, "Добавьте хотя бы одно изображение в галерею")
        .default([]),
    characteristics: z.array(characteristicSchema).optional(),
    sale: saleSchema.optional(),
    icon: z
        .union([z.instanceof(File), z.null(), z.undefined()])
        .optional()
        .refine((file) => !file || (file instanceof File && file.size > 0), {
            message: "Файл обязателен",
        }),
    iconAlt: z.string().optional().nullable(),
    seoTitle: z.string().min(1, "Обязательное поле").max(60, "Максимум 60 символов"),
    seoDescription: z.string().min(1, "Обязательное поле").max(160, "Максимум 160 символов"),
});

export const updateProductSchema = z.object({
    category: z.string().min(1, 'Категория обязательна'),
    title: z.string().min(1, {message: "Название обязательно"}).max(200, {message: "Максимум 200 символов"}),
    description: z.string().optional(),
    coverAlt: z.string().optional().nullable(),
    cover: z.union([z.instanceof(File), z.null(), z.undefined()]).optional(),
    iconAlt: z.string().optional().nullable(),
    icon: z.union([z.instanceof(File), z.null(), z.undefined()]).optional(),
    characteristics: z.array(characteristicSchema).optional(),
    sale: saleSchema.optional(),
    seoTitle: z.string().min(1, "Обязательное поле").max(60, "Максимум 60 символов"),
    seoDescription: z.string().min(1, "Обязательное поле").max(160, "Максимум 160 символов"),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;