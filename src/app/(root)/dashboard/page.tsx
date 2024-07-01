import { CreateLink } from "@/components/forms/LinkForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClicksForUrls } from "@/lib/actions/clicks.action";
import { getUrls } from "@/lib/actions/urls.actions";
import { getUser } from "@/lib/actions/user.actions";
import { UrlType } from "@/types";
import { Metadata } from "next";
import LinkCard from "./_components/LinkCard";
import SearchLinkBox from "./_components/SearchLinkBox";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Dashboard | Trimrr URL Shortener App",
  description: "A simple and efficient URL shortener application Auth.",
};

type SearchParams = {
  searchParams: { [key: string]: string };
};
export default async function page({ searchParams }: SearchParams) {
  const user = await getUser();
  const urls: UrlType[] = await getUrls(user?.id!);
  let clicks;
  if (urls.length > 0) {
    clicks = await getClicksForUrls(urls.map((url) => url.id));
  }

  const filteredUrls =
    urls.length > 0 &&
    urls.filter((url) => {
      return searchParams.query
        ? url.title.toLowerCase().includes(searchParams.query.toLowerCase())
        : url;
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
      {(filteredUrls || []).map((url, i: number) => (
        <LinkCard key={i} {...url} />
      ))}
    </div>
  );
}
