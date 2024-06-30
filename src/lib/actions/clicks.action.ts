"use server";

import { detectDevice } from "@/utils/detectDevice";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";

const fetchUserLocation = async () => {
  try {
    const ip = await axios.get("https://api.ipify.org");
    if (!ip.data) {
      throw new Error("Failed to fetch IP address");
    }
    const address = await axios.get(`http://ip-api.com/json/${ip.data}`);
    if (!address.data) {
      throw new Error("Failed to fetch location");
    }
    return address.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export async function getClicksForUrls(urlIds: string[]) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("clicks")
      .select("*")
      .in("url_id", urlIds);

    if (error) {
      throw new Error(error.message);
    }
    console.log(data);

    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function storeClicks({
  id,
  user_agent,
}: {
  id: string;
  user_agent: string;
}) {
  try {
    const device = detectDevice(user_agent);
    const { city, country } = await fetchUserLocation();
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

    return JSON.parse(JSON.stringify(data));
  } catch (error: any) {
    throw new Error(error.message);
  }
}
