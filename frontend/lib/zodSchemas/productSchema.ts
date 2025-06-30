import { z } from "zod";

const characteristicSchema = z.object({
    key: z.string().min(1),
    value: z.string().min(1),
});

const saleSchema = z.object({
    isOnSale: z.boolean(),
    label: z.string().optional().nullable(),
});

const iconSchema = z.object({
    alt: z.string().optional(),
    url: z.string().url().optional(),
});

const imageItemSchema = z.object({
    url: z.instanceof(File).refine(file => file.size > 0),
    alt: z.string().optional(),
});

export const createProductSchema = z.object({
    category: z.string().min(1),
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    coverAlt: z.string().optional().nullable(),
    cover: z.instanceof(File).refine(file => file.size > 0),
    images: z.array(imageItemSchema).optional(),
    characteristics: z.array(characteristicSchema).optional(),
    sale: saleSchema.optional(),
    icon: iconSchema.optional(),
});

export const updateProductSchema = z.object({
    category: z.string().min(1, 'Категория обязательна'),
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    coverAlt: z.string().optional().nullable(),
    cover: z.union([z.instanceof(File), z.null(), z.undefined()]).optional(),
    images: z.array(imageItemSchema).optional(),
    characteristics: z.array(characteristicSchema).optional(),
    sale: saleSchema.optional(),
    icon: iconSchema.optional(),
});

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;