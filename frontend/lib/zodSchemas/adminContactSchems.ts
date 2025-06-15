import {z} from "zod";

export const adminContactSchema = z.object({
    location: z.string().min(1, "Обязательное поле"),
    phone1: z.string().min(1, "Обязательное поле"),
    phone2: z.string().optional(),
    email: z.string().email("Неверный email").min(1, "Обязательное поле"),
    instagram: z.string().min(1, "Обязательное поле"),
    whatsapp: z.string().min(1, "Обязательное поле"),
    linkLocation: z.string().min(1, "Обязательное поле"),
    mapLocation: z.string().min(1, "Обязательное поле"),
    workingHours: z.object({
        monday: z.string().min(1, "Обязательное поле"),
        tuesday: z.string().min(1, "Обязательное поле"),
        wednesday: z.string().min(1, "Обязательное поле"),
        thursday: z.string().min(1, "Обязательное поле"),
        friday: z.string().min(1, "Обязательное поле"),
        saturday: z.string().min(1, "Обязательное поле"),
        sunday: z.string().min(1, "Обязательное поле"),
    }),
});
