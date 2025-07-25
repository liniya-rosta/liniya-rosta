import {z} from "zod";

export const portfolioSchema = z.object({
    cover: z.instanceof(File, {message: "Обложка обязательна"}).nullable(),
    description: z.object({
        ru: z.string()
    }),
    coverAlt: z.object({
        ru: z.string()
            .min(1, "Пропишите альтернативное название обложки")
            .max(150, "Максимальное количество символов 150"),
    }),
    gallery: z
        .array(
            z.object({
                alt: z.object({
                    ru: z.string(),
                }),
                image: z.instanceof(File, {message: "Добавьте изображение"}).nullable(),
            })
        )
        .min(1, "Добавьте хотя бы одно изображение в галерею"),
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
    coverAlt: z.object({
        ru: z.string(),
    }).optional(),
    description: z.object({
        ru: z.string(),
    }).optional(),
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
    alt: z.object({
        ru: z.string(),
    }).optional(),
});

