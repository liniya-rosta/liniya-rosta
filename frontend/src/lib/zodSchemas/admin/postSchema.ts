import { z } from "zod";

const langString = z.object({
    ru: z.string().min(1, "Обязательное поле"),
});

const altSchema = z.object({
    ru: z.string().min(1, "Описание alt на русском обязательно"),
});

export const createPostSchema = z.object({
    title: langString,
    description: langString,
    images: z.array(
        z.object({
            file: z.instanceof(File).nullable(),
            alt: altSchema.optional(),
        })
    ).min(1, "Добавьте хотя бы одно изображение"),
    seoTitle: z.string().min(1, "Обязательное поле").max(60, "Максимум 60 символов"),
    seoDescription: z.string().min(1, "Обязательное поле").max(160, "Максимум 160 символов")
});

export const updatePostSchema = z
    .object({
        title: langString.optional(),
        description: langString.optional(),
        images: z.array(
            z.object({
                file: z.instanceof(File, { message: "Файл обязателен" }).nullable(),
                alt: altSchema.optional(),
            })
        ).optional(),
        seoTitle: z.string().min(1, "Обязательное поле").max(60, "Максимум 60 символов"),
        seoDescription: z.string().min(1, "Обязательное поле").max(160, "Максимум 160 символов")
    })
    .refine(
        (data) => data.title || data.description || data.images,
        {
            message: "Хотя бы одно поле должно быть передано",
        }
    );

export const updatePostImageSchema = z.object({
    imageUrl: z.string().min(1, "Ссылка на изображение обязательна"),
    alt: altSchema.optional(),
    newImage: z.instanceof(File).optional(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type UpdatePostFormData = z.infer<typeof updatePostSchema>;
export type UpdatePostImageFormData = z.infer<typeof updatePostImageSchema>;
