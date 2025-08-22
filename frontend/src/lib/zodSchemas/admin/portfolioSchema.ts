import {z} from "zod";

export const portfolioSchema = z.object({
    cover: z
        .any()
        .refine((file) => file instanceof File && file.size > 0, {
            message: "Обложка обязательна",
        }),
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
    seoTitle: z.object({
        ru: z.string()
    }),
    seoDescription:  z.object({
        ru: z.string()
    }),
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

