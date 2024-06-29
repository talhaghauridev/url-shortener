import { Metadata } from "next";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/lib/actions/user.actions";
import SearchLinkBox from "./_components/SearchLinkBox";
import { getUrls } from "@/lib/actions/urls.actions";
import { getClicksForUrls } from "@/lib/actions/clicks.action";
import LinkCard from "./_components/LinkCard";
import { CreateLink } from "@/components/forms/LinkForm";
export const metadata: Metadata = {
  title: "Dashboard | Trimrr URL Shortener App",
  description: "A simple and efficient URL shortener application Auth.",
};

type SearchParams = {
  searchParams: { [key: string]: string };
};

const page = async ({ searchParams }: SearchParams) => {
  const user = await getUser();
  const urls = await getUrls(user?.id!);
  let clicks;
  if (urls.length > 0) {
    clicks = await getClicksForUrls(urls?.map((url: any) => url.id));
  }

  const filteredUrls =
    urls.length > 0 &&
    urls?.filter((url: any) => {
      return searchParams.query
        ? url.title.toLowerCase().includes(searchParams.query.toLowerCase())
        : url;
    });
  console.log({
    clicks,
    urls,
  });

  return (
    <div className="flex max-w-[1300px] mx-auto py-[50px] px-[20px] flex-col gap-8">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="sm:text-[25px] text-[15px]">
              Links Created
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="sm:text-[25px] text-[15px]">
              Total Clicks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length || 0}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between">
        <h1 className="text-4xl font-extrabold">My Links</h1>
        <CreateLink />
      </div>
      <SearchLinkBox />
      {(filteredUrls || []).map((url: any, i: number) => (
        <LinkCard key={i} url={url} />
      ))}
    </div>
  );
};

export default page;
