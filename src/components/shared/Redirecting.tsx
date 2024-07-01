"use client";
import { storeClicks } from "@/lib/actions/clicks.action";
import { getLongUrl } from "@/lib/actions/urls.actions";
import { actionErrorHandler } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useEffect } from "react";
import { BarLoader } from "react-spinners";

type RedirectingParams = {
  id: string;
};

const user_agent = typeof navigator !== "undefined" ? navigator.userAgent : "";

const Redirecting = ({ id }: RedirectingParams) => {
  const {
    isExecuting: loadingLongUrl,
    result: longUrlData,
    execute: fetchLongUrl,
  } = useAction(getLongUrl);
  const {
    isExecuting: loadingClicks,
    execute: logClicks,
    result: storeClicksData,
  } = useAction(storeClicks);

  const memoizedFetchLongUrl = useCallback((id: string) => {
    setTimeout(() => {
      fetchLongUrl({ id });
    }, 0);
  }, []);
  const memoizedLogClicks = useCallback(
    (data: { id: string; user_agent: string }) => {
      setTimeout(() => {
        logClicks(data);
      }),
        0;
    },
    []
  );

  useEffect(() => {
    if (id) {
      memoizedFetchLongUrl(id);
    }
  }, [id]);

  useEffect(() => {
    if (!loadingLongUrl && longUrlData?.data && user_agent) {
      memoizedLogClicks({
        id: String(longUrlData.data.id),
        user_agent,
      });
      if (typeof window !== "undefined") {
        window.location.href = String(longUrlData.data.original_url);
      }
    }
  }, [loadingLongUrl, longUrlData]);

  useEffect(() => {
    if (!loadingLongUrl || !loadingClicks) {
      actionErrorHandler(longUrlData || storeClicksData);
    }
  }, [loadingLongUrl, loadingClicks, longUrlData, storeClicksData]);

  if (loadingLongUrl || loadingClicks) {
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        <h1 className="flex items-center justify-center w-full text-[18px] md:text-[20px]">
          Redirecting...
        </h1>
      </>
    );
  }

  return null;
};

export default Redirecting;
