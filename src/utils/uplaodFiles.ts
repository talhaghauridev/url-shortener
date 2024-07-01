import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

type UploadFileParams = {
  name: string;
  profile_pic: File;
};

export const uploadUserFile = async ({
  profile_pic,
  name,
}: UploadFileParams): Promise<string | null> => {
  try {
    const supabase = createClient();
    const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;
    const { error: storageError } = await supabase.storage
      .from("profile_pic")
      .upload(fileName, profile_pic);
    if (storageError) {
      toast.error(storageError.message);
      return null;
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) throw Error("Supabase URL not found");
    return `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`;
  } catch (error: any) {
    toast.error(error.message);
    return null;
  }
};

export const uploadQRCodeFile = async (qrcode: string) => {
  try {
    const supabase = createClient();
    const short_url = Math.random().toString(36).substr(2, 6);
    const fileName = `qr-${short_url}`;
    const { error: storageError } = await supabase.storage
      .from("qrs")
      .upload(fileName, qrcode);
    if (storageError) {
      toast.error(storageError.message);
      return null;
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) throw Error("Supabase URL not found");

    return `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;
  } catch (error: any) {
    toast.error(error.message);
    return null;
  }
};

export const removeQRCodeFile = async (url: string) => {
  try {
    const supabase = createClient();
    const regex = /\/qrs\/(qr-[a-zA-Z0-9]+)/;
    const fileName = url.match(regex);

    if (fileName === null || !fileName[1]) {
      toast.error("Invalid Url");
      return false;
    }
    const { error: storageError, data } = await supabase.storage
      .from("qrs")
      .remove([fileName[1]]);
    if (storageError) {
      toast.error(storageError.message);
      return false;
    }

    return true;
  } catch (error: any) {
    toast.error(error.message);
    return false;
  }
};
