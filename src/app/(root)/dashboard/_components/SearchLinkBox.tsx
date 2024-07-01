"use client";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const SearchLinkBox = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState<string>(searchParams.get("query") || "");
  const handleSearch = useCallback(
    (input: string) => {
      if (input.trim() !== "") {
        router.push(`/dashboard?query=` + input);
      } else {
        router.push(`/dashboard`);
      }
    },
    [router]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, handleSearch]);

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Filter Links..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Filter className="absolute top-2 right-2 p-1" />
    </div>
  );
};

export default SearchLinkBox;
