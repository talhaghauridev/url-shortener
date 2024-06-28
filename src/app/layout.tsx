import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UrlProvider } from "@/context/UrlContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "URL Shortener App",
  description: "A simple and efficient URL shortener application.",
  keywords: "URL shortener, link shortener, shorten URL, short links",
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
      </body>
    </html>
  );
}
