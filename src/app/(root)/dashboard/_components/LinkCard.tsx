import LinkButtons from "@/components/shared/LinkButtons";
import { UrlType } from "@/types";
import { LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

const LinkCard = (url: UrlType) => {
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
      <LinkButtons {...url} />
    </div>
  );
};

export default memo(LinkCard);
