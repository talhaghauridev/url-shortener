"use server";
import { actionClient } from "@/utils/serverActionClient";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  SignInValidation,
  SignUpValidation,
  SignoutValidation,
} from "../validations/user.validations";

export const signin = actionClient
  .schema(SignInValidation)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error?.message) throw new Error(error.message);
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

export const signup = actionClient
  .schema(SignUpValidation)
  .action(async ({ parsedInput: { email, name, password, profile_pic } }) => {
    try {
      const supabase = createClient();
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            profile_pic,
          },
        },
      });
      if (error) throw new Error(error.message);
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

export const getUser = actionClient.action(async () => {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw Error(error.message);
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const signout = actionClient
  .schema(SignoutValidation)
  .action(async ({ parsedInput: { path } }) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw Error(error.message);
      revalidatePath(path);
      return true;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });
