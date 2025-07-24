import { z } from "zod";

export const languageSchema = z.object({
    ru: z.string().min(1, "Поле обязательно"),
});

export const serviceSchema = z.object({
    title: languageSchema,
    description: languageSchema.partial().optional(),
});

export const serviceEditSchema = serviceSchema.partial();