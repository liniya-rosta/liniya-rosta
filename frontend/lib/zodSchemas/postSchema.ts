import { z } from "zod";

export const createPostSchema = z.object({
    title: z.string().min(1, "Заголовок обязателен"),
    description: z.string().min(1, "Описание обязательно"),
    images: z
        .array(z.instanceof(File))
        .min(1, "Хотя бы одно изображение обязательно"),
    alts: z
        .union([z.string(), z.array(z.string())])
        .optional(),
});

export const updatePostSchema = z
    .object({
        title: z.string().min(1, "Заголовок не может быть пустым").optional(),
        description: z
            .string()
            .min(1, "Описание не может быть пустым")
            .optional(),
        images: z.array(z.instanceof(File)).optional(),
        alts: z
            .union([z.string(), z.array(z.string())])
            .optional(),
    })
    .refine(
        (data) =>
            data.title || data.description || data.images || data.alts,
        {
            message: "Хотя бы одно поле должно быть передано",
        }
    );

export const updatePostImageSchema = z.object({
    imageUrl: z.string().min(1, "Ссылка на изображение обязательна"),
    alt: z.string().optional(),
    newImage: z.instanceof(File).optional(),
});

export const removeImageSchema = z.object({
    image: z.string().min(1, "URL изображения обязателен"),
});


export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type UpdatePostFormData = z.infer<typeof updatePostSchema>;
export type UpdatePostImageFormData = z.infer<typeof updatePostImageSchema>;
