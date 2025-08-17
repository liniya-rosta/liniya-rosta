import {z} from "zod";
import {hasBadWords} from "@/src/lib/profanityFilter";

export const chatUserSchema = z.object({
    name: z.string()
        .min(2, "Имя слишком короткое")
        .max(50, "Имя слишком длинное")
        .refine((val) => !hasBadWords(val), "Имя содержит недопустимые слова")
        .refine((val) => !/(.)\1{4,}/.test(val), "Имя содержит повторяющиеся символы"),
    phone: z.string()
        .min(11, "Введите полный номер телефона"),
});

export const chatMessageSchema = z.object({
    text: z.string()
        .min(1, "Сообщение не может быть пустым")
        .max(500, "Сообщение слишком длинное")
        .refine((val) => !hasBadWords(val), "Сообщение содержит недопустимые слова")
        .refine((val) => !/(.)\1{5,}/.test(val), "Сообщение содержит повторяющиеся символы"),
});

export type ChatUserForm = z.infer<typeof chatUserSchema>;
export type ChatMessageForm = z.infer<typeof chatMessageSchema>;