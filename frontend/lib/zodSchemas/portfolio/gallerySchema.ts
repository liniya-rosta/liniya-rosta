import {z} from "zod";

export const gallerySchema = z.object({
   image: z.instanceof(File).nullable().optional(),
   alt: z.string().optional(),
});