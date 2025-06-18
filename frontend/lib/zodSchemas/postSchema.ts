import { z } from "zod";

export const createPostSchema = z.object({
    title: z.string().min(1, 'Заголовок обязателен').max(200, 'Заголовок слишком длинный'),
    description: z.string().min(1, 'Описание обязательно').max(1000, 'Описание слишком длинное'),
    image: z
        .instanceof(File, { message: 'Изображение обязательно для нового поста' })
        .refine((file) => file.size > 0, 'Изображение обязательно'),
});


export const updatePostSchema = z.object({
    title: z.string().min(1, 'Заголовок обязателен').max(200, 'Заголовок слишком длинный'),
    description: z.string().min(1, 'Описание обязательно').max(1000, 'Описание слишком длинное'),
    image: z.any().optional(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type UpdatePostFormData = z.infer<typeof updatePostSchema>;
