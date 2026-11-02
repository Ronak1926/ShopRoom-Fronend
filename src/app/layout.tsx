import type { Metadata } from "next";
import {
  DM_Sans,
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
import ClientErrorReporter from "../components/ClientErrorReporter";
import { SITE_URL } from "../lib/site";

// Only the app's own text face (Manrope) is preloaded. Monospace is a small corner of a few
// screens, and the notification fonts below are needed only when a banner is drawn: they
// download the moment something uses them instead of competing with the first paint.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

// Notification Studio text-tool font choices (see features/notifications/fonts.ts).
// Loaded on the root layout — the studio renders font-family from arbitrary
// JSON data via inline styles, so every option must already be on the page.
const notifInter = Inter({ variable: "--font-notif-inter", subsets: ["latin"], preload: false });
const notifPoppins = Poppins({ variable: "--font-notif-poppins", subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"], preload: false });
const notifRoboto = Roboto({ variable: "--font-notif-roboto", subsets: ["latin"], weight: ["300", "400", "500", "700", "900"], preload: false });
const notifMontserrat = Montserrat({ variable: "--font-notif-montserrat", subsets: ["latin"], preload: false });
const notifOpenSans = Open_Sans({ variable: "--font-notif-open-sans", subsets: ["latin"], preload: false });
const notifLato = Lato({ variable: "--font-notif-lato", subsets: ["latin"], weight: ["300", "400", "700", "900"], preload: false });
const notifPlayfair = Playfair_Display({ variable: "--font-notif-playfair-display", subsets: ["latin"], preload: false });
const notifDmSans = DM_Sans({ variable: "--font-notif-dm-sans", subsets: ["latin"], preload: false });
const notifPlusJakarta = Plus_Jakarta_Sans({ variable: "--font-notif-plus-jakarta-sans", subsets: ["latin"], preload: false });


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  authors: [{ name: "ShopRoom", url: SITE_URL }],
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
    url: SITE_URL,
    siteName: "ShopRoom",
    title: "ShopRoom — Your Neighbourhood Shop, Delivered to Your Feed",
    description:
      "Discover local shops, get real-time stock alerts, and stay ahead of the rush. ShopRoom is the hyper-local platform built for physical retail.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopRoom — Your Neighbourhood Shop, Delivered to Your Feed",
    description:
      "Discover local shops, get real-time stock alerts, and stay ahead of the rush.",
    creator: "@shoproom_in",
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
      className={`${geistMono.variable} ${manrope.variable} ${notifInter.variable} ${notifPoppins.variable} ${notifRoboto.variable} ${notifMontserrat.variable} ${notifOpenSans.variable} ${notifLato.variable} ${notifPlayfair.variable} ${notifDmSans.variable} ${notifPlusJakarta.variable} h-full antialiased`}
    >
      {/*
        Browser extensions (ColorZilla's cz-shortcut-listen, Grammarly, LastPass…)
        inject attributes onto <body> before React hydrates, which React reports
        as a hydration mismatch. This suppresses only THIS element's own
        attribute diff — mismatches inside the app still surface normally.
      */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ClientErrorReporter />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
