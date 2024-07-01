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

const fetchUserAndUrls = async (): Promise<UrlType[]> => {
  const user = await getUser();
  if (!user?.data?.id) throw new Error("User not found");

  const urlsData = await getUrls({ userId: String(user.data.id) });
  return urlsData?.data || [];
};

const fetchClicksForUrls = async (urlIds: string[]) => {
  const clicksData = await getClicksForUrls({ urlIds: urlIds.map(String) });
  return clicksData?.data || [];
};

const filterUrls = (urls: UrlType[], query?: string): UrlType[] => {
  if (!query) return urls;
  const lowercasedQuery = query.toLowerCase();
  return urls.filter((url) =>
    url.title.toLowerCase().includes(lowercasedQuery)
  );
};

export default async function page({ searchParams }: SearchParams) {
  const urls = await fetchUserAndUrls();
  const urlIds = urls.map((url) => url.id);
  const clicks = urlIds.length > 0 ? await fetchClicksForUrls(urlIds) : [];
  const filteredUrls = filterUrls(urls, searchParams.query);

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
      {filteredUrls.length === 0 ? (
        <h1 className="w-full sm:h-[140px] h-[120px] flex items-center justify-center text-[18px] sm:text-[22px]">
          No Links Found
        </h1>
      ) : (
        filteredUrls.map((url, i: number) => <LinkCard key={i} {...url} />)
      )}
    </div>
  );
}
