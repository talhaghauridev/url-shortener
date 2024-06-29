import { createClient } from "@/utils/supabase/client";
import { type ClassValue, clsx } from "clsx";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

type UploadFileParams = {
  name: string;
  profile_pic: File;
};

export const uploadFile = async ({
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
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_pic/${fileName}`;
  } catch (error: any) {
    toast.error(error.message);
    return null;
  }
};
