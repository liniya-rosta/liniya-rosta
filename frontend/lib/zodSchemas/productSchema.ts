import { z } from "zod";

export const createProductSchema = z.object({
    category: z.string().min(1, 'Категория обязательна'),
    title: z.string().min(1, 'Название обязательно').max(200, 'Название слишком длинное'),
    description: z.string().optional(),
    image: z
        .instanceof(File)
        .refine((file) => file.size > 0, 'Изображение обязательно для нового продукта'),
});


export const updateProductSchema = z.object({
    category: z.string().min(1, 'Категория обязательна'),
    title: z.string().min(1, 'Название обязательно').max(200, 'Название слишком длинное'),
    description: z.string().optional(),
    image: z.any().optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
