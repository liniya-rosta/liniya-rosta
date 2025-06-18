import z from "zod";

export const portfolioItemSchema = z.object({
    cover: z.instanceof(File).optional().nullable(),
    coverAlt: z.string().optional(),
    description: z.string().optional(),
});