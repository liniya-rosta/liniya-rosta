import {z} from "zod"

export const userLoginSchema = z
    .object({
        email: z
            .string()
            .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Неправильный формат почты")
            .min(1, "Введите email"),
        password: z.string().min(1, "Введите пароль"),
        confirmPassword:  z.string().min(1, "Подтвердите пароль"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    });