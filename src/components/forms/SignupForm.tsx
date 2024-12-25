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
import { signup } from "@/lib/actions/user.actions";
import { actionErrorHandler } from "@/lib/utils";
import {
  SignUpType,
  SignUpValidation,
} from "@/lib/validations/user.validations";
import { uploadUserFile } from "@/utils/uplaodFiles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { memo, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";
const initialValues: SignUpType = {
  name: "",
  email: "",
  password: "",
  profile_pic: "",
};

const SignupForm = () => {
  const searchParams = useSearchParams();
  const longLink = searchParams.get("createNew");
  const router = useRouter();
  const { fetchUser, isAuthenticated, loading: userLoading } = useUrlContext();
  const form = useForm({
    defaultValues: initialValues,
    mode: "onBlur",
    resolver: zodResolver(SignUpValidation),
  });

  const {
    execute: fnSignup,
    result: data,
    isExecuting: loading,
    hasSucceeded,
  } = useAction(signup);
  const onSubmit = useCallback(
    async ({ name, profile_pic, ...rest }: SignUpType) => {
      const uploadedUrl = await uploadUserFile({ name, profile_pic });
      if (uploadedUrl) {
        await fnSignup({ ...rest, name, profile_pic: uploadedUrl });
      }
    },
    [fnSignup]
  );

  const handleImage = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      fileChange: (value: File) => void
    ) => {
      e.preventDefault();
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        fileChange(file);
      }
    },
    []
  );
  const handleRedirect = useCallback(() => {
    if (isAuthenticated && !userLoading) {
      router.push(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      return;
    }

    if (data.data) {
      fetchUser();
      router.push(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`, {
        scroll: false,
      });
    }
  }, [isAuthenticated, userLoading, longLink, data, router, fetchUser]);

  useEffect(() => {
    if (data?.data) {
      handleRedirect();
    }
  }, [data, handleRedirect]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Sign up to create a new account</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-white">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="profile_pic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-white">Profile Picture</FormLabel>
                  <FormControl>
                    <Input
                      className="file:!text-white"
                      type="file"
                      accept="image/*"
                      placeholder="Add profile photo"
                      onChange={(e) => handleImage(e, field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={
                loading ||
                !form.formState.isValid ||
                !form.getValues().profile_pic
              }
              className="w-[136px] flex items-center justify-center !mt-5 disabled:selection:bg-none"
            >
              {loading ? (
                <BeatLoader size={10} color="black" />
              ) : (
                "Create Account"
              )}
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
};

export default memo(SignupForm);
