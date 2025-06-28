import {z} from "zod";

export const serviceSchema = z.object({
    title: z.string().min(1, "Поле названия услуги обязательна"),
    description: z.string().optional(),
});