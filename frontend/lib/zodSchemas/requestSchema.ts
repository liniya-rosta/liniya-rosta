import {z} from "zod";

const phoneRegex = /^\+?\d{9,}$/;

const requestSchema = z.object({
    name: z.string().min(2, "Введите имя"),
    email: z.string().email("Введите корректную почту"),
    phone: z.string()
        .min(9, "Введите номер телефона")
        .regex(phoneRegex, "Номер должен начинаться с + (опционально) и содержать минимум 9 цифр"),
});

export default requestSchema;