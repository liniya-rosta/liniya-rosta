import {z} from "zod";

const createAdminSchema = z.object({
    displayName: z.string().min(1, "Имя обязательно"),
    email: z.string().email("Некорректный email"),
    password: z.string().min(6, "Минимум 6 символов"),
    confirmPassword: z.string().min(6, "Подтвердите пароль"),
    role: z.enum(["admin", "superadmin"]),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"]
});

export default createAdminSchema;