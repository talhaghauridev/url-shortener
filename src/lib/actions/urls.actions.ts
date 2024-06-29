"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { UrlType } from "../validations/urls.validations";

export async function getUrls(userId: string) {
  try {
    const supabase = createClient();

    const { data } = await supabase
      .from("urls")
      .select("*")
      .eq("user_id", userId);
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteUrl(id: string, path: string) {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("urls").delete().eq("id", id);
    revalidatePath(path);
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

type CreateUrlParams = UrlType & { user_id: string; qr: string };
export async function createUrl({
  title,
  longUrl,
  customUrl,
  user_id,
  qr,
}: CreateUrlParams) {
  try {
    const short_url = Math.random().toString(36).substr(2, 6);

    const supabase = createClient();
    const { data, error } = await supabase.from("urls").insert([
      {
        title,
        user_id,
        original_url: longUrl,
        custom_url: customUrl || null,
        short_url,
        qr,
      },
    ]);
    if (error) {
      throw new Error(error.message);
    }
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error(error.message);
  }
}
