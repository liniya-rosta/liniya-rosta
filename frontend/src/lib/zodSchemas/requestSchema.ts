import { z } from "zod";

export const getRequestSchema = (t: (key: string) => string) => {
    const phoneRegex = /^\+?\d{9,13}$/;

    return z.object({
        name: z.string().min(2, t("name")),
        email: z.string().email(t("email")),
        phone: z
            .string()
            .min(9, t("phoneMin"))
            .regex(phoneRegex, t("phoneInvalid")),
    });
};
