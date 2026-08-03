import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";

import { Providers } from "../store/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://shoproom.in";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  applicationName: "ShopRoom",
  title: {
    default: "ShopRoom — Your Neighbourhood Shop, Delivered to Your Feed",
    template: "%s | ShopRoom",
  },
  description:
    "ShopRoom connects customers to their favourite local shops — real-time stock updates, personalised alerts, and hyper-local discovery. No algorithms, just your street.",
  keywords: [
    "local shop discovery",
    "neighbourhood shops",
    "hyperlocal shopping",
    "shop stock alerts",
    "local business platform",
    "shopkeeper app",
    "ShopRoom",
    "near me shops",
    "real-time stock updates",
    "local retail",
  ],
  authors: [{ name: "ShopRoom", url: APP_URL }],
  creator: "ShopRoom",
  publisher: "ShopRoom",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_URL,
    siteName: "ShopRoom",
    title: "ShopRoom — Your Neighbourhood Shop, Delivered to Your Feed",
    description:
      "Discover local shops, get real-time stock alerts, and stay ahead of the rush. ShopRoom is the hyper-local platform built for physical retail.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShopRoom — Hyper-Local Shop Discovery Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopRoom — Your Neighbourhood Shop, Delivered to Your Feed",
    description:
      "Discover local shops, get real-time stock alerts, and stay ahead of the rush.",
    images: ["/og-image.png"],
    creator: "@shoproom_in",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
