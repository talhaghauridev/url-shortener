"use server";

import { createClient } from "@/utils/supabase/server";

export async function getClicksForUrls(urlIds: string[]) {
  try {
    const supabase = createClient();

    const { data } = await supabase
      .from("clicks")
      .select("*")
      .in("url_id", urlIds);
    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error(error.message);
  }
}
