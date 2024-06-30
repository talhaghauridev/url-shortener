"use client";
import useFetch from "@/hooks/useFetch";
import { storeClicks } from "@/lib/actions/clicks.action";
import { getLongUrl } from "@/lib/actions/urls.actions";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { toast } from "react-toastify";

type RedirectingParams = {
  id: string;
};

const user_agent = typeof navigator !== "undefined" && navigator.userAgent;
const Redirecting = ({ id }: RedirectingParams) => {
  const {
    loading,
    data,
    fn: fuLongUrl,
    error: errLongUrl,
  } = useFetch(getLongUrl);

  const {
    loading: loadingStats,
    fn: fnStats,
    error: errStats,
  } = useFetch(storeClicks);

  useEffect(() => {
    if (
      !loading &&
      data &&
      typeof data === "object" &&
      "id" in data &&
      "original_url" in data &&
      user_agent
    ) {
      fnStats({
        id: data.id as string,
        user_agent,
      });
      if (typeof window !== "undefined") {
        window.location.href = String(data.original_url);
      }
    }
  }, [loading, data, user_agent]);

  useEffect(() => {
    if ((!loadingStats && errLongUrl) || errStats) {
      toast.error(String(errLongUrl || errStats));
    }
  }, [loadingStats, errLongUrl, errStats]);

  useEffect(() => {
    if (id) {
      fuLongUrl(id);
    }
  }, [id]);

  if (loading || loadingStats) {
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
