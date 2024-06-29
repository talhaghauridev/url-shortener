import LoginForm from "@/components/forms/LoginForm";
import SignupForm from "@/components/forms/SignupForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth | Trimrr URL Shortener App",
  description: "A simple and efficient URL shortener application Auth.",
};

type SearchParams = {
  searchParams: { [key: string]: string | undefined };
};

function Auth({ searchParams }: SearchParams) {
  return (
    <section id="auth" className="w-full h-full">
      <div className="max-w-[1300px]  py-[55px] md:py-[80px]  px-[10px] sm:px-[20px] mx-auto flex flex-col items-center gap-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold">
          {searchParams?.createNew
            ? "Hold up! Let's login first.."
            : "Login / Signup"}
        </h1>
        <Tabs defaultValue="login" className="w-[100%] sm:w-[450px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Auth;
