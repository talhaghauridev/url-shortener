"use server";
import { actionClient } from "@/utils/serverActionClient";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import {
  CreateUrlValidation,
  DeleteUrlValidation,
  GetLongUrlValidation,
  GetUrlValidation,
  GetUrlsValidation,
} from "../validations/urls.validations";

export const getUrls = actionClient
  .schema(GetUrlsValidation)
  .action(async ({ parsedInput: { userId } }) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("urls")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

export const getUrl = actionClient
  .schema(GetUrlValidation)
  .action(async ({ parsedInput: { userId, id } }) => {
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
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

export const getLongUrl = actionClient
  .schema(GetLongUrlValidation)
  .action(async ({ parsedInput: { id } }) => {
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
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

export const deleteUrl = actionClient
  .schema(DeleteUrlValidation)
  .action(async ({ parsedInput: { id, path } }) => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("urls").delete().eq("id", id);
      revalidatePath(path);
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

export const createUrl = actionClient
  .schema(CreateUrlValidation)
  .action(
    async ({
      parsedInput: { title, longUrl, customUrl, user_id, qr, path },
    }) => {
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
        return data;
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  );
