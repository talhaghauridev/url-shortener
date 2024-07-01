"use client";
import React, { memo, useCallback, useEffect } from "react";
import { Button } from "../ui/button";
import { Copy, Download, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { download } from "@/lib/utils";
import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/lib/actions/urls.actions";
import { UrlType } from "@/types";

type LinkButtonsProps = UrlType & {
  redirect?: boolean;
};
const LinkButtons = ({ redirect = false, ...url }: LinkButtonsProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const downloadImage = async () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;
    download(imageUrl, fileName);
  };

  const copyUrl = useCallback(() => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_APP_URL!}/${url?.short_url}`
    );
    toast.success("Copied Url");
  }, [url?.short_url, toast]);
  const { loading: loadingDelete, fn: fnDelete, error } = useFetch(deleteUrl);

  const handleDeleteUrl = useCallback(() => {
    fnDelete(url.id as any, pathname).then(() => {
      if (redirect) {
        router.push("/dashboard");
      } else {
        toast.success("Url deleted successfully");
      }
    });
  }, [pathname, url.id, toast, redirect, router]);

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
