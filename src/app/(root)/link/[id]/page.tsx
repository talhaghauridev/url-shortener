"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUrlContext } from "@/context/UrlContext";
import useFetch from "@/hooks/useFetch";
import { getClicksForUrls } from "@/lib/actions/clicks.action";
import { getUrl } from "@/lib/actions/urls.actions";
import LinkButtons from "@/components/shared/LinkButtons";
import { UrlType } from "@/types";
import { LinkIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import DeviceStats from "../_components/DeviceStats";
import Location from "../_components/Location";

const LinkPage = () => {
  const router = useRouter();
  const { user } = useUrlContext();
  const { id }: { id: string } = useParams();
  const {
    loading,
    data: url,
    fn: funUrl,
    error,
  } = useFetch<UrlType, typeof getUrl>(getUrl);
  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch<any, typeof getClicksForUrls>(getClicksForUrls);

  useEffect(() => {
    funUrl({ id, userId: user?.id! });
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats([id]);
  }, [loading, error]);

  if (error) {
    router.push("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      <div className="flex max-w-[1300px] mx-auto py-[30px] md:py-[50px] flex-col gap-8 sm:flex-row justify-between">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          <span className="text-6xl font-extrabold hover:underline cursor-pointer">
            {url?.title}
          </span>
          <a
            href={`https://trimrr.in/${link}`}
            target="_blank"
            className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer"
          >
            https://trimrr.in/{link}
          </a>
          <a
            href={url?.original_url}
            target="_blank"
            className="flex items-center gap-1 hover:underline cursor-pointer"
          >
            <LinkIcon className="p-1" />
            {url?.original_url}
          </a>
          <span className="flex items-end font-extralight text-sm">
            {new Date(url?.created_at!).toLocaleString()}
          </span>
          {url && <LinkButtons {...url} redirect={true} />}
          <Image
            placeholder="empty"
            src={url?.qr!}
            className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
            alt="qr code"
            width={400}
            height={400}
          />
        </div>

        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
          </CardHeader>
          {stats && stats.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stats?.length}</p>
                </CardContent>
              </Card>

              <CardTitle>Location Data</CardTitle>
              <Location stats={stats} />
              <CardTitle>Device Info</CardTitle>
              <DeviceStats stats={stats} />
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No Statistics yet"
                : "Loading Statistics.."}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default LinkPage;
