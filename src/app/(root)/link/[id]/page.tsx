"use client";
import LinkButtons from "@/components/shared/LinkButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUrlContext } from "@/context/UrlContext";
import useFetch from "@/hooks/useFetch";
import { getClicksForUrls } from "@/lib/actions/clicks.action";
import { getUrl } from "@/lib/actions/urls.actions";
import { UrlType } from "@/types";
import { LinkIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BarLoader } from "react-spinners";
import Location from "../_components/Location";
import DeviceStats from "../_components/DeviceStats";
const LinkPage = () => {
  const [initialLoading, setInitialLoading] = useState(true);
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
    if (user?.id && id) {
      funUrl({ id, userId: user.id });
    }
  }, [funUrl, user?.id, id]);

  useEffect(() => {
    if (!error && loading === false) fnStats([id]);
  }, [loading, error, id, fnStats]);

  if (error) {
    router.push("/dashboard");
  }

  const link = useMemo(() => {
    return url?.custom_url || url?.short_url || "";
  }, [url?.custom_url, url?.short_url]);

  const isFetching = useMemo(
    () => loading || loadingStats,
    [loading, loadingStats]
  );

  useEffect(() => {
    if (isFetching === false) {
      setInitialLoading(false);
    }
  }, [isFetching]);
  return useMemo(
    () => (
      <>
        {initialLoading && (
          <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
        )}
        <div className="flex max-w-[1300px] mx-auto py-[30px] md:py-[50px] px-[10px] md:px-[20px] flex-col gap-8 md:flex-row justify-between">
          <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
            {initialLoading ? (
              <Skeleton className="w-[250px] h-[60px]" />
            ) : (
              <span className="text-6xl font-extrabold hover:underline cursor-pointer">
                {url?.title}
              </span>
            )}
            {initialLoading ? (
              <Skeleton className="w-[400px] h-[33px]" />
            ) : (
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/${link}`}
                target="_blank"
                className="text-[18px] sm:text-[25px] text-blue-400 font-bold hover:underline cursor-pointer  h-[33px]"
              >
                {process.env.NEXT_PUBLIC_APP_URL}/{link}
              </a>
            )}

            {initialLoading ? (
              <Skeleton className="w-[146px] h-[22px]" />
            ) : (
              <a
                href={url?.original_url}
                target="_blank"
                className="flex items-center gap-1 hover:underline cursor-pointer"
              >
                <LinkIcon className="p-1" />
                {url?.original_url}
              </a>
            )}

            {initialLoading ? (
              <Skeleton className="w-[146px] h-[20px]" />
            ) : (
              <span className="flex items-end font-extralight text-sm">
                {new Date(url?.created_at!).toLocaleString()}
              </span>
            )}
            {initialLoading ? (
              <Skeleton className="w-[137px] h-[40px]" />
            ) : (
              !initialLoading && url && <LinkButtons {...url} redirect={true} />
            )}

            <div className="flex items-center justify-start w-full ">
              {initialLoading ? (
                <Skeleton className="w-full max-w-[100%] md:max-w-[350px] h-[350px] p-1" />
              ) : (
                <Image
                  placeholder="empty"
                  src={url?.qr!}
                  className="w-full max-w-[100%] md:max-w-[350px] self-center p-1 object-contain"
                  alt="qr code"
                  width={400}
                  height={400}
                />
              )}
            </div>
          </div>

          <Card className="sm:w-3/5  ">
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
            </CardHeader>
            {initialLoading ? (
              <Skeleton className="w-[100%] max-w-[100%]  h-[650px]" />
            ) : stats && stats.length ? (
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
                {initialLoading === false && !stats
                  ? "No Statistics yet"
                  : "Loading Statistics.."}
              </CardContent>
            )}
          </Card>
        </div>
      </>
    ),
    [stats, loadingStats, initialLoading, url, link]
  );
};

export default LinkPage;
