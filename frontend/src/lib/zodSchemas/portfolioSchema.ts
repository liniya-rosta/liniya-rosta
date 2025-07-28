import {z} from "zod";

export const portfolioSchema = z.object({
    cover: z.instanceof(File, {message: "Обложка обязательна"}).nullable(),
    description: z.string(),
    coverAlt: z.string()
        .min(1, "Пропишите альтернативное название обложки")
        .max(150, "Максимальное количество символов 150"),
    gallery: z
        .array(
            z.object({
                alt: z.string().optional(),
                image: z.instanceof(File, {message: "Добавьте изображение"}).nullable(),
            })
        )
        .min(1, "Добавьте хотя бы одно изображение в галерею")
        .default([]),
    seoTitle: z
        .string()
        .min(1, "SEO-заголовок обязателен")
        .max(120, "Максимум 120 символов"),
    seoDescription: z
        .string()
        .min(1, "SEO-описание обязательно")
        .max(300, "Максимум 300 символов"),
});

export const portfolioItemSchema = z.object({
    cover: z.instanceof(File).optional().nullable(),
    coverAlt: z.string().optional(),
    description: z.string().optional(),
    seoTitle: z
        .string()
        .min(1, "SEO-заголовок обязателен")
        .max(120, "Максимум 120 символов")
        .optional(),
    seoDescription: z
        .string()
        .min(1, "SEO-описание обязательно")
        .max(300, "Максимум 300 символов")
        .optional(),
});

export const gallerySchema = z.object({
    image: z.instanceof(File).nullable().optional(),
    alt: z.string().optional(),
});