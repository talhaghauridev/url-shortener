"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUrlContext } from "@/context/UrlContext";
import useFetch from "@/hooks/useFetch";
import { signin } from "@/lib/actions/user.actions";
import {
  SignInType,
  SignInValidation,
} from "@/lib/validations/user.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";
const initialValues: SignInType = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: userLoading, fetchUser } = useUrlContext();
  const longLink = searchParams.get("createNew");
  const router = useRouter();

  const form = useForm({
    defaultValues: initialValues,
    mode: "onBlur",
    resolver: zodResolver(SignInValidation),
  });

  const { loading, error, fn: fnLogin, data } = useFetch(signin);

  const onSubmit = useCallback((values: SignInType) => {
    console.log(values);
  }, []);

  const handleRedirect = useCallback(() => {
    if (isAuthenticated && !userLoading) {
      router.push(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      return;
    }

    if (error === null && data) {
      fetchUser();
      router.push(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`, {
        scroll: false,
      });
    }
  }, [isAuthenticated, userLoading, longLink, error, data, router, fetchUser]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          to your account if you already have one
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-white">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-white">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={loading || !form.formState.isValid}
              className="w-[136px] flex items-center justify-center !mt-5 disabled:selection:bg-none"
            >
              {loading ? <BeatLoader size={10} color="black" /> : "Login"}
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
};

export default LoginForm;
