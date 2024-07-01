"use client";
import { banner1 } from "@/Images";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUrlContext } from "@/context/UrlContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const [longUrl, setLongUrl] = useState("");
  const { user, loading, isAuthenticated } = useUrlContext();
  const router = useRouter();

  const handleShorten = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loading && longUrl && user == null && !isAuthenticated) {
      router.push(`/auth?createNew=${longUrl}`);
    } else if (!loading && user && longUrl && isAuthenticated) {
      router.push(`/dashboard?${longUrl ? `createNew=${longUrl}` : ""}`);
    }
  };

  return (
    <div className="max-w-[1300px] mx-auto pb-[30px] flex flex-col items-center">
      <h2 className="px-[10px] sm:px-[20px] my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
        The only URL Shortener <br /> you&rsquo;ll ever need! 👇
      </h2>
      <form
        onSubmit={handleShorten}
        className="sm:h-[50px] px-[10px] sm:px-[20px] flex flex-col sm:flex-row w-full md:w-2/4 gap-2"
      >
        <Input
          type="url"
          placeholder="Enter your long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          className="h-full flex-1 py-4 px-4"
        />
        <Button type="submit" className="h-full" variant="destructive">
          Shorten!
        </Button>
      </form>
      <Image
        src={banner1.src}
        className="w-full my-11 md:px-11"
        alt="Url Shortener banner"
        width={600}
        height={600}
        placeholder="blur"
        blurDataURL={banner1.blurDataURL}
      />
      <Accordion
        type="multiple"
        className="w-full md:px-11 px-[10px] sm:px-[20px]"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>
            How does the Trimrr URL shortener work?
          </AccordionTrigger>
          <AccordionContent>
            When you enter a long URL, our system generates a shorter version of
            that URL. This shortened URL redirects to the original long URL when
            accessed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Do I need an account to use the app?
          </AccordionTrigger>
          <AccordionContent>
            Yes. Creating an account allows you to manage your URLs, view
            analytics, and customize your short URLs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            What analytics are available for my shortened URLs?
          </AccordionTrigger>
          <AccordionContent>
            You can view the number of clicks, geolocation data of the clicks,
            and device types (mobile/desktop) for each of your shortened URLs.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Page;
