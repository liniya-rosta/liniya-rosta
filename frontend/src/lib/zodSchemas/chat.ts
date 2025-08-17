import {z} from "zod";
import {hasBadWords} from "@/src/lib/profanityFilter";

export const createChatUserSchema = (t: (key: string) => string) =>
    z.object({
        name: z.string()
            .min(2, t("name"))
            .max(50, t("name"))
            .refine((val) => !hasBadWords(val), t("messageHasBadWords"))
            .refine((val) => !/(.)\1{4,}/.test(val), t("nameRepeatingChars")),
        phone: z.string()
            .min(11, t("phoneMin")),
    });

export const createChatMessageSchema = (t: (key: string) => string) =>
    z.object({
        text: z.string()
            .min(1, t("messageEmpty"))
            .max(500, t("messageTooLong"))
            .refine((val) => !/\S{30,}/.test(val), t("messageTooLongWord"))
            .refine((val) => !hasBadWords(val), t("messageHasBadWords"))
            .refine((val) => !/(.)\1{5,}/.test(val), t("messageRepeatingChars")),
    });

export type ChatUserForm = z.infer<ReturnType<typeof createChatUserSchema>>;
export type ChatMessageForm = z.infer<ReturnType<typeof createChatMessageSchema>>;