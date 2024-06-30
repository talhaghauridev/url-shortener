"use client";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/lib/actions/urls.actions";
import { download } from "@/lib/utils";
import { UrlType } from "@/lib/validations/urls.validations";
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
type LinkCardProps = {
  id: string;
  created_at: Date;
  original_url: string;
  short_url: string;
  custom_url: string;
  user_id: string;
  title: string;
  qr: string;
};

const LinkCard = ({ url }: { url: LinkCardProps }) => {
  const pathname = usePathname();

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
      toast.success("Url deleted successfully");
    });
  }, [pathname, url.id, toast]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);
  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <Image
        src={url?.qr}
        className="h-[120px] md:h-[134px] object-contain ring ring-blue-500 self-start max-w-fit"
        alt="qr code"
        height={400}
        width={400}
      />
      <Link href={`/link/${url?.id}`} className="flex flex-col flex-1">
        <span className="text-3xl font-extrabold hover:underline cursor-pointer">
          {url?.title}
        </span>
        <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer">
          {process.env.NEXT_PUBLIC_APP_URL!}/
          {url?.custom_url ? url?.custom_url : url.short_url}
        </span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer">
          <LinkIcon className="p-1" />
          {url?.original_url}
        </span>
        <span className="flex items-end font-extralight text-sm flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
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
    </div>
  );
};

export default LinkCard;
