"use client";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/lib/actions/urls.actions";
import { actionErrorHandler, download } from "@/lib/utils";
import { UrlType } from "@/types";
import { removeQRCodeFile } from "@/utils/uplaodFiles";
import { Copy, Download, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useAction } from "next-safe-action/hooks";

type LinkButtonsProps = UrlType & {
  redirect?: boolean;
};

const LinkButtons = ({ redirect = false, ...url }: LinkButtonsProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const link = useMemo(() => url?.custom_url || url?.short_url || "", [url]);

  const downloadImage = useCallback(() => {
    if (url?.qr && url?.title) {
      download(url.qr, url.title);
    } else {
      toast.error("Image URL or title is missing.");
    }
  }, [url?.qr, url?.title]);

  const copyUrl = useCallback(() => {
    const urlToCopy = `${process.env.NEXT_PUBLIC_APP_URL!}/${link}`;
    navigator.clipboard
      .writeText(urlToCopy)
      .then(() => toast.success("URL copied to clipboard successfully."))
      .catch(() => toast.error("Failed to copy URL."));
  }, [link]);

  const {
    isExecuting: loadingDelete,
    executeAsync: fnDelete,
    result,
  } = useAction(deleteUrl);
  const { loading: loadingRemoveFile, fn: fnRemoveQR } =
    useFetch(removeQRCodeFile);

  const handleDeleteUrl = useCallback(async () => {
    try {
      await fnDelete({ id: url.id, path: pathname });
      await fnRemoveQR(url.qr);
      if (redirect) {
        router.push("/dashboard");
      } else {
        toast.success("Url deleted successfully");
      }
    } catch (err) {
      toast.error("Failed to delete URL or QR code.");
    }
  }, [pathname, redirect, router, url.id, url.qr]);

  useEffect(() => {
    actionErrorHandler(result);
  }, [result.fetchError]);

  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="icon" onClick={copyUrl}>
        <Copy />
      </Button>
      <Button variant="ghost" size="icon" onClick={downloadImage}>
        <Download />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDeleteUrl}
        disabled={loadingDelete || loadingRemoveFile}
      >
        <Trash />
      </Button>
    </div>
  );
};

export default memo(LinkButtons);
