import {z} from "zod";

export const editAdminSchema = z.object({
    email: z.string().email("Некорректный email"),
    displayName: z.string().min(1, "Имя обязательно"),
    role: z.enum(["admin", "superadmin"]),
});

export type EditAdminSchema = z.infer<typeof editAdminSchema>;