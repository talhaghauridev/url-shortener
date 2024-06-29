import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UrlProvider } from "@/context/UrlContext";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trimrr URL Shortener App",
  description: "A simple and efficient URL shortener application.",
  keywords: "Trimrr URL shortener, link shortener, shorten URL, short links",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UrlProvider>{children}</UrlProvider>
        <ToastContainer draggable stacked theme="dark" />
        <NextTopLoader showSpinner={false} />
      </body>
    </html>
  );
}
