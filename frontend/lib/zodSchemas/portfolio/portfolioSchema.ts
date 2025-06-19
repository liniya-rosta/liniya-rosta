import {z} from "zod";

export const portfolioSchema = z.object({
    cover: z.instanceof(File, {message: "Обложка обязательна"}).nullable(),
    description: z.string(),
    coverAlt: z.string()
        .min(1, "Пропишите альтернативное название обложки")
        .max(150, "Максимальное количество символов 150"),
    gallery: z
        .array(
            z.object({
                alt: z.string().min(1, "Альтернативное название обложки обязательно"),
                image: z.instanceof(File, {message: "Добавьте изображение"}).nullable(),
            })
        )
        .min(1, "Добавьте хотя бы одно изображение в галерею")
        .default([]),
});