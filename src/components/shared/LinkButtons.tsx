"use client";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/lib/actions/urls.actions";
import { download } from "@/lib/utils";
import { UrlType } from "@/types";
import { Copy, Download, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";

type LinkButtonsProps = UrlType & {
  redirect?: boolean;
};
const LinkButtons = ({ redirect = false, ...url }: LinkButtonsProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const link = useMemo(() => {
    return url?.custom_url || url?.short_url || "";
  }, [url?.custom_url, url?.short_url]);

  const downloadImage = useCallback(async () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;
    download(imageUrl, fileName);
  }, [url?.qr, url?.title]);

  const copyUrl = useCallback(() => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_APP_URL!}/${link}`
    );
    toast.success("URL copied to clipboard successfully.");
  }, [url?.short_url]);

  const { loading: loadingDelete, fn: fnDelete, error } = useFetch(deleteUrl);

  const handleDeleteUrl = useCallback(() => {
    fnDelete(url.id as any, pathname).then(() => {
      if (redirect) {
        router.push("/dashboard");
      } else {
        toast.success("Url deleted successfully");
      }
    });
  }, [pathname, url.id, redirect, router, fnDelete]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);
  return (
    <div className="flex gap-2">
      <Button variant="ghost" size={"icon"} onClick={copyUrl}>
        <Copy />
      </Button>
      <Button variant="ghost" size={"icon"} onClick={downloadImage}>
        <Download />
      </Button>
      <Button
        variant="ghost"
        onClick={handleDeleteUrl}
        disabled={loadingDelete}
        size={"icon"}
      >
        <Trash />
      </Button>
    </div>
  );
};

export default memo(LinkButtons);
