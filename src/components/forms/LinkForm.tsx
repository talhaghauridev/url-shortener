"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUrlContext } from "@/context/UrlContext";
import useFetch from "@/hooks/useFetch";
import { createUrl } from "@/lib/actions/urls.actions";
import { UrlType, UrlValidation } from "@/lib/validations/urls.validations";
import { uploadQRCodeFile } from "@/utils/uplaodFiles";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { QRCode } from "react-qrcode-logo";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
interface UrlData {
  [key: string]: any;
}

export function CreateLink() {
  const { user } = useUrlContext();
  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef<any>(null);
  let searchParams = useSearchParams();
  const longLink = searchParams.get("createNew");
  const initialValues = {
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  };
  const { loading, error, data, fn: fnCreateUrl } = useFetch(createUrl);

  const form = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(UrlValidation),
    mode: "onBlur",
  });

  const onSubmit = useCallback(
    async (values: UrlType) => {
      try {
        const canvas = ref?.current.canvasRef.current;
        const blob = await new Promise((resolve) => canvas.toBlob(resolve));
        const qrCode = await uploadQRCodeFile(blob as string);
        if (qrCode) {
          await fnCreateUrl({
            ...values,
            user_id: user?.id!,
            path: pathname,
            qr: qrCode,
          });
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    [user, ref]
  );
  console.log(data);

  useEffect(() => {
    if (error === null && data) {
      router.push(`/link/${String((data as UrlData[])[0].id)}`);
    }
  }, [error, data, router]);

  return (
    <Dialog
      defaultOpen={longLink ? true : false}
      onOpenChange={(res) => {
        if (!res && longLink) {
          router.push("/dashboard");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
        </DialogHeader>
        {form.getValues().longUrl && (
          <QRCode ref={ref} size={250} value={form.getValues().longUrl} />
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="title"
                      placeholder="Short Link's Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="longUrl"
                      placeholder="Enter your Loooong URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Card className="p-2">trimrr.in</Card> /
                      <Input
                        id="customUrl"
                        placeholder="Custom Link (optional)"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading || !form.formState.isValid}
              variant="destructive"
              className="w-[136px] flex items-center justify-center mt-5 md:!mt-7 disabled:selection:bg-none"
            >
              {loading ? <BeatLoader size={10} color="white" /> : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
