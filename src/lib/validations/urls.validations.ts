import * as z from "zod";

export const UrlValidation = z.object({
  title: z
    .string()
    .max(30, { message: "Maximum 30 caracters." })
    .nonempty("Title is required"),
  longUrl: z.string().url("Must be a valid url"),
  customUrl: z.string().optional(),
});

export const CreateUrlValidation = z.object({
  title: z.string(),
  longUrl: z.string().url(),
  customUrl: z.string().optional(),
  user_id: z.string(),
  qr: z.string(),
  path: z.string(),
});

export const GetUrlValidation = z.object({
  userId: z.string(),
  id: z.string(),
});

export const DeleteUrlValidation = z.object({
  id: z.string(),
  path: z.string(),
});

export const GetLongUrlValidation = z.object({
  id: z.string(),
});

export const GetUrlsValidation = z.object({
  userId: z.string(),
});

export type UrlType = z.infer<typeof UrlValidation>;
