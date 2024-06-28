import * as z from "zod";

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Minimum 8 characters." })
    .max(20, { message: "Maximum 20 caracters." }),
});

export const SignUpValidation = z.object({
  name: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(30, { message: "Maximum 30 caracters." }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Minimum 8 characters." })
    .max(20, { message: "Maximum 20 caracters." }),
  profile_pic: z.string().nonempty(),
});

type SignInType = z.infer<typeof SignInValidation>;
type SignUpType = z.infer<typeof SignUpValidation>;

export type { SignInType, SignUpType };
