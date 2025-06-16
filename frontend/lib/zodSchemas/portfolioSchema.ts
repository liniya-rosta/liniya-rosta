import {z} from "zod";

export const portfolioSchema = z.object({
    cover:  z.instanceof(File),
    description: z.string(),
    alt: z.string()
        .min(1, "Пропишите альтернативное название обложки")
        .max(150, "Максимальное количество символов 150"),
    gallery: z.array(z.instanceof(File)),
});