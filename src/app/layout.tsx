import type { Metadata } from "next";
import {
  DM_Sans,
  Fraunces,
  Geist,
  Geist_Mono,
  Inter,
  Lato,
  Manrope,
  Montserrat,
  Open_Sans,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Poppins,
  Roboto,
} from "next/font/google";
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

// Notification Studio text-tool font choices (see features/notifications/fonts.ts).
// Loaded on the root layout — the studio renders font-family from arbitrary
// JSON data via inline styles, so every option must already be on the page.
const notifInter = Inter({ variable: "--font-notif-inter", subsets: ["latin"] });
const notifPoppins = Poppins({ variable: "--font-notif-poppins", subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });
const notifRoboto = Roboto({ variable: "--font-notif-roboto", subsets: ["latin"], weight: ["300", "400", "500", "700", "900"] });
const notifMontserrat = Montserrat({ variable: "--font-notif-montserrat", subsets: ["latin"] });
const notifOpenSans = Open_Sans({ variable: "--font-notif-open-sans", subsets: ["latin"] });
const notifLato = Lato({ variable: "--font-notif-lato", subsets: ["latin"], weight: ["300", "400", "700", "900"] });
const notifPlayfair = Playfair_Display({ variable: "--font-notif-playfair-display", subsets: ["latin"] });
const notifDmSans = DM_Sans({ variable: "--font-notif-dm-sans", subsets: ["latin"] });
const notifPlusJakarta = Plus_Jakarta_Sans({ variable: "--font-notif-plus-jakarta-sans", subsets: ["latin"] });

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
      className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${fraunces.variable} ${notifInter.variable} ${notifPoppins.variable} ${notifRoboto.variable} ${notifMontserrat.variable} ${notifOpenSans.variable} ${notifLato.variable} ${notifPlayfair.variable} ${notifDmSans.variable} ${notifPlusJakarta.variable} h-full antialiased`}
    >
      {/*
        Browser extensions (ColorZilla's cz-shortcut-listen, Grammarly, LastPass…)
        inject attributes onto <body> before React hydrates, which React reports
        as a hydration mismatch. This suppresses only THIS element's own
        attribute diff — mismatches inside the app still surface normally.
      */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
