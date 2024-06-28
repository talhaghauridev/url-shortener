"use server";

import { supabase } from "@/utils/supabase/server";
import { SignInType, SignUpType } from "../validations/user.validations";
import { revalidatePath } from "next/cache";

export async function signin({ email, password }: SignInType) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw Error(error.message);
    return data;
  } catch (error: unknown) {
    throw new Error("Error in signup");
  }
}

export async function signup({
  name,
  email,
  password,
  profile_pic,
}: SignUpType) {
  try {
    const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;
    const { error: storageError } = await supabase.storage
      .from("profile_pic")
      .upload(fileName, profile_pic);
    if (storageError) throw Error(storageError.message);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) throw Error("Supabase URL not found");
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`,
        },
      },
    });
    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    throw new Error("Error in signup");
  }
}

export async function getUser() {
  try {
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
    const { error } = await supabase.auth.signOut();
    if (error) throw Error(error.message);
    revalidatePath(path);
    return true;
  } catch (error) {
    throw new Error("Error in signing out");
  }
}
