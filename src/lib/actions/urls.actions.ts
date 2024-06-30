"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { UrlType } from "../validations/urls.validations";

export async function getUrls(userId: string) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("urls")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      throw new Error(error.message);
    }
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getUrl({ userId, id }: { userId: string; id: string }) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("urls")
      .select("*")
      .eq("user_id", userId)
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getLongUrl(id: string) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("urls")
      .select("id, original_url")
      .or(`short_url.eq.${id},custom_url.eq.${id}`)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error("Error fetching short link:", error.message);
    }
    if (error) {
      throw new Error(error.message);
    }
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

type CreateUrlParams = UrlType & { user_id: string; qr: string; path: string };

export async function createUrl({
  title,
  longUrl,
  customUrl,
  user_id,
  qr,
  path,
}: CreateUrlParams) {
  try {
    const short_url = Math.random().toString(36).substr(2, 6);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("urls")
      .insert([
        {
          title,
          user_id,
          original_url: longUrl,
          custom_url: customUrl || null,
          short_url,
          qr,
        },
      ])
      .select();
    if (error) {
      throw new Error(error.message);
    }
    revalidatePath(path);
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error(error.message);
  }
}
