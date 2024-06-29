import * as z from "zod";

export const UrlValidation = z.object({
  title: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(30, { message: "Maximum 30 caracters." }),
  longUrl: z.string().url("Must be a valid url"),
  customUrl: z.string().optional(),
});

export type UrlType = z.infer<typeof UrlValidation>;
