"use client";
import localFont from "next/font/local";
import "./globals.css";
import { DataContextProvider, THandler } from "../context/DataContext";
import { fetchMockData } from "../actions/campaign";
import { fetchGiftShelves } from "../actions/gift-shelf-list";
import { fetchOrderList } from "../actions/order-list";
import { fetchTierList } from "@/actions/tier-list";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const handler: Record<string, THandler> = {
    "campaign-list": async () => {
      return await fetchMockData();
    },
    "gift-shelf-list": async () => {
      return await fetchGiftShelves();
    },
    "order-list": async (params) => {
      return await fetchOrderList(params);
    },
    "tier-list": async () => {
      return await fetchTierList();
    },
  };

  const fetch = async (name: string, params?: any) => {
    console.log("fetch");
    return await handler?.[name as keyof typeof handler]?.(params);
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DataContextProvider fetch={fetch}>{children}</DataContextProvider>
      </body>
    </html>
  );
}
