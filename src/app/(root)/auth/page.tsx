"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUrlContext } from "@/context/UrlContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Login from "./_components/Login";
import Signup from "./_components/Signup";

function Auth() {
  let searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, loading } = useUrlContext();
  const longLink = searchParams.get("createNew");

  useEffect(() => {
    if (isAuthenticated && !loading)
      router.push(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
  }, [isAuthenticated, loading, router]);

  return (
    <section id="auth" className="w-full h-full">
      <div className="max-w-[1300px] py-[60px]  px-[10px] sm:px-[20px] mx-auto flex flex-col items-center gap-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold">
          {searchParams.get("createNew")
            ? "Hold up! Let's login first.."
            : "Login / Signup"}
        </h1>
        <Tabs defaultValue="login" className="w-[100%] sm:w-[450px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Login />
          </TabsContent>
          <TabsContent value="signup">
            <Signup />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Auth;
