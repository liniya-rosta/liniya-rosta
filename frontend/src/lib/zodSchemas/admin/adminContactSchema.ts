import { z } from "zod";

export const adminContactSchema = z.object({
    location: z.object({
        ru: z.string().min(1, "Обязательное поле"),
    }),
    phone1: z.string().min(1, "Обязательное поле"),
    phone2: z.string().optional(),
    email: z.string().email("Неверный email").min(1, "Обязательное поле"),
    whatsapp: z.string().min(1, "Обязательное поле"),
    linkLocation: z.string().min(1, "Обязательное поле"),
    mapLocation: z.string().min(1, "Обязательное поле"),
    workingHours: z.object({
        monday: z.object({
            ru: z.string().min(1, "Обязательное поле"),
        }),
        tuesday: z.object({
            ru: z.string().min(1, "Обязательное поле"),
        }),
        wednesday: z.object({
            ru: z.string().min(1, "Обязательное поле"),
        }),
        thursday: z.object({
            ru: z.string().min(1, "Обязательное поле"),
        }),
        friday: z.object({
            ru: z.string().min(1, "Обязательное поле"),
        }),
        saturday: z.object({
            ru: z.string().min(1, "Обязательное поле"),
        }),
        sunday: z.object({
            ru: z.string().min(1, "Обязательное поле"),
        }),
    }),
});
