import {z} from "zod";

export const adminContactSchema = z.object({
    location: z.string().min(1, 'Обязательное поле'),
    phone1: z.string().min(1, 'Обязательное поле'),
    phone2: z.string().optional(),
    email: z.string().email('Неверный email'),
    instagram: z.string().optional(),
    whatsapp: z.string().optional(),
    linkLocation: z.string().min(1, 'Обязательное поле'),
    mapLocation: z.string().min(1, 'Обязательное поле'),
    workingHours: z.object({
        monday: z.string(),
        tuesday: z.string(),
        wednesday: z.string(),
        thursday: z.string(),
        friday: z.string(),
        saturday: z.string(),
        sunday: z.string(),
    }),
});
