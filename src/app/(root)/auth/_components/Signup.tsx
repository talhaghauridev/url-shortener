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
import { signin, signup } from "@/lib/actions/user.actions";
import {
  SignInType,
  SignInValidation,
  SignUpType,
  SignUpValidation,
} from "@/lib/validations/user.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";
const initialValues: SignUpType = {
  name: "",
  email: "",
  password: "",
  profile_pic: "",
};

const Signup = () => {
  const searchParams = useSearchParams();
  const longLink = searchParams.get("createNew");
  const router = useRouter();

  const form = useForm({
    defaultValues: initialValues,
    mode: "onBlur",
    resolver: zodResolver(SignUpValidation),
  });

  const { loading, error, fn: fnLogin, data } = useFetch(signup);
  const { fetchUser } = useUrlContext();

  const redirectDashboard = useCallback(() => {
    if (error === null && data) {
      fetchUser();
      router.push(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`, {
        scroll: false,
      });
    }
  }, [error, data, router]);

  useEffect(() => {
    redirectDashboard();
  }, [redirectDashboard]);

  const onSubmit = useCallback((values: SignUpType) => {
    console.log(values);
  }, []);
  const handleImage = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      fileChange: (value: string) => void
    ) => {
      e.preventDefault();
      const fileReader = new FileReader();
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];

        if (!file.type.includes("image")) return;
        fileReader.onload = async (event) => {
          const imageUrl = event.target?.result?.toString() || "";
          fileChange(imageUrl);
        };
        fileReader.readAsDataURL(file);
      }
    },
    []
  );
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-white">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Name" type="name" {...field} />
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
                    <Input placeholder="Enter Email" type="email" {...field} />
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
              disabled={loading || !form.formState.isValid}
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

export default Signup;
