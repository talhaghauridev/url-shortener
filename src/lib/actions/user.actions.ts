"use server";

import { createClient } from "@/utils/supabase/server";
import { SignInType, SignUpType } from "../validations/user.validations";
import { revalidatePath } from "next/cache";

export async function signin({ email, password }: SignInType) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function signup({
  name,
  email,
  password,
  profile_pic,
}: SignUpType) {
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
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getUser() {
  try {
    const supabase = createClient();

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw Error(error.message);
    return session;
  } catch (error) {
    throw new Error("Error in getting user");
  }
}

export async function signout(path: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw Error(error.message);
    revalidatePath(path);
    return true;
  } catch (error) {
    throw new Error("Error in signing out");
  }
}
