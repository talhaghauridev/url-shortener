"use server";

import { detectDevice } from "@/utils/detectDevice";
import { actionClient } from "@/utils/serverActionClient";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import {
  GetClicksForUrlsValidation,
  StoreClicksValidation,
} from "../validations/clicks.validations";

export const fetchUserLocation = actionClient.action(async () => {
  try {
    const address = await axios.get("http://ip-api.com/json");

    if (!address.data) {
      throw new Error("Fetch user location error");
    }
    return address.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
});

export const getClicksForUrls = actionClient
  .schema(GetClicksForUrlsValidation)
  .action(async ({ parsedInput: { urlIds } }) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("clicks")
        .select("*")
        .in("url_id", urlIds);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

export const storeClicks = actionClient
  .schema(StoreClicksValidation)
  .action(async ({ parsedInput: { id, user_agent } }) => {
    try {
      const device = detectDevice(user_agent);
      const location = await fetchUserLocation();
      const { city, country } = location?.data;
      const supabase = createClient();
      const { error, data } = await supabase.from("clicks").insert({
        url_id: id,
        city,
        country,
        device: device.deviceType,
      });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });
