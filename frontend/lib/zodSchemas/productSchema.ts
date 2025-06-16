import { z } from "zod";

export const createProductSchema = z.object({
    category: z.string().min(1, 'Категория обязательна'),
    title: z.string().min(1, 'Название обязательно').max(200, 'Название слишком длинное'),
    description: z.string().optional(),
    image: z
        .instanceof(File, { message: 'Изображение обязательно для нового продукта' })
        .refine((file) => file.size > 0, 'Изображение не может быть пустым'),
});

export const updateProductSchema = z.object({
    category: z.string().min(1, 'Категория обязательна'),
    title: z.string().min(1, 'Название обязательно').max(200, 'Название слишком длинное'),
    description: z.string().optional(),
    image: z.union([
        z.instanceof(File),
        z.null(),
        z.undefined()
    ]).optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;