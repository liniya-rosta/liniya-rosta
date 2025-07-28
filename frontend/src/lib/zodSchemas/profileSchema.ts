import {z} from "zod";

export const profileSchema = z.object({
    displayName: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 2, {
            message: "Имя должно быть не короче 2 символов",
        }),

    email: z
        .string()
        .optional()
        .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
            message: "Некорректная почта",
        }),

    password: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 3, {
            message: "Пароль должен быть не короче 3 символов",
        }),
});