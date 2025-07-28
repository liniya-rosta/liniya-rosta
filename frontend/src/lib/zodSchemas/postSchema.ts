import { z } from "zod";

export const createPostSchema = z.object({
    title: z.string().min(1, "Заголовок обязателен"),
    description: z.string().min(1, "Описание обязательно"),
    images: z.array(
        z.object({
            file: z.instanceof(File).nullable(),
            alt: z.string().optional(),
        })
    ) .min(1, "Добавьте хотя бы одно изображение")
});

export const updatePostSchema = z
    .object({
        title: z.string().min(1, "Заголовок не может быть пустым").optional(),
        description: z
            .string()
            .min(1, "Описание не может быть пустым")
            .optional(),
        images: z.array(
            z.object({
                file: z.instanceof(File, { message: "Файл обязателен" }).nullable(),
                alt: z.string().optional(),
            })
        )
        .optional()
    })
    .refine(
        (data) =>
            data.title || data.description || data.images,
        {
            message: "Хотя бы одно поле должно быть передано",
        }
    );

export const updatePostImageSchema = z.object({
    imageUrl: z.string().min(1, "Ссылка на изображение обязательна"),
    alt: z.string().optional(),
    newImage: z.instanceof(File).optional(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type UpdatePostFormData = z.infer<typeof updatePostSchema>;
export type UpdatePostImageFormData = z.infer<typeof updatePostImageSchema>;