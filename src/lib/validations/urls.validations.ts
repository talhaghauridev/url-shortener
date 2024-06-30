import * as z from "zod";

export const UrlValidation = z.object({
  title: z
    .string()
    .max(30, { message: "Maximum 30 caracters." })
    .nonempty("Title is required"),
  longUrl: z.string().url("Must be a valid url"),
  customUrl: z.string().optional(),
});

export type UrlType = z.infer<typeof UrlValidation>;
