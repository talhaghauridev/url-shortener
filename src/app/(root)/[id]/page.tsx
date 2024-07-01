import Redirecting from "@/components/shared/Redirecting";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redirecting | Trimrr URL Shortener App",
  description: "A simple and efficient URL shortener application Redirecting.",
};

type Params = {
  params: {
    id: string;
  };
};
const page = ({ params }: Params) => {
  return <Redirecting id={params.id} />;
};

export default page;
