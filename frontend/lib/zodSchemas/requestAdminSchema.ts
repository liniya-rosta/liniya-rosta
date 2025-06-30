import {z} from "zod";

export const requestAdminSchema = z.object({
    name: z.string().min(1, "Обязательное поле"),
    phone: z.string().min(8, "Обязательное поле, минимальное колличество символов 8"),
    email: z.string().email("Неверный email").min(1, "Обязательное поле"),
    commentOfManager: z.string().optional(),
    status: z.enum(["Новая", "В работе", "Завершена", "Отклонена"]).refine((val) => !!val, {
        message: "Статус обязателен",
    })
});
