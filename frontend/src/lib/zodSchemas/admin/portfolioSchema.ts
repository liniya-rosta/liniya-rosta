import {z} from "zod";

export const portfolioSchema = z.object({
    title: z
        .string({ required_error: "Название обязательно" })
        .min(1, "Название обязательно")
        .max(120, "Максимальная длина названия — 120 символов"),

    cover: z
        .any()
        .refine((file) => file instanceof File && file.size > 0, {
            message: "Обложка обязательна для загрузки",
        }),

    description: z
        .string({ required_error: "Описание обязательно" })
        .min(1, "Описание обязательно"),

    coverAlt: z
        .string({ required_error: "Альтернативное название обязательно" })
        .min(1, "Пропишите альтернативное название обложки")
        .max(150, "Максимальная длина — 150 символов"),

    gallery: z
        .array(
            z.object({
                alt: z
                    .string({ required_error: "Альтернативный текст обязателен" })
                    .min(1, "Пропишите описание изображения"),
                image: z
                    .instanceof(File, { message: "Добавьте изображение" })
                    .nullable(),
            })
        )
        .min(1, "Добавьте хотя бы одно изображение в галерею"),

    seoTitle: z
        .string({ required_error: "SEO-заголовок обязателен" })
        .min(1, "SEO-заголовок обязателен"),

    seoDescription: z
        .string({ required_error: "SEO-описание обязательно" })
        .min(1, "SEO-описание обязательно"),
});

export const portfolioEditSchema = z.object({
    title: z.object({
        ru: z.string().max(120),
    }).optional(),

    cover: z
        .any()
        .transform((val) => (val instanceof FileList ? val[0] : val))
        .refine((val) => val == null || val instanceof File, {
            message: "Нужно выбрать файл",
        })
        .optional()
        .nullable(),

    coverAlt: z.object({
        ru: z.string(),
    }).optional(),

    description: z.object({
        ru: z.string(),
    }).optional(),

    seoTitle: z
        .object({
            ru: z.string(),
        })
        .optional(),

    seoDescription: z
        .object({
            ru: z.string(),
        })
        .optional(),

    gallery: z
        .array(
            z.object({
                image: z.instanceof(File).optional(),
                alt: z
                    .object({
                        ru: z.string(),
                    })
                    .optional(),
            })
        )
        .optional(),
});

export const gallerySchema = z.object({
    image: z.instanceof(File).nullable().optional(),
    alt: z.object({
        ru: z.string(),
    }).optional(),
});

