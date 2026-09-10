import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";
import { IS_PUBLIC_LAUNCH } from "@/lib/launch";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "800", "900"],
  display: "swap",
});

const SITE = {
  name: "خیریان",
  title: "خیریان | بسته‌بندی",
  description:
    "طراحی و تولید کارتن پنج لایه با چاپ اختصاصی — استحکام، جذب ضربه و محافظت کامل از محصول.",

  // Resolves relative og:image URLs. Getting this wrong means broken link
  // previews in WhatsApp and Telegram, which is how this link actually
  // reaches the client, so it falls back to the real host rather than to
  // localhost. CF_PAGES_URL only exists when Cloudflare runs the build
  // itself; on a local `wrangler pages deploy` it is absent, which is why
  // the production default is hardcoded rather than left to the env.
  // Set NEXT_PUBLIC_SITE_URL once a custom domain is attached.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.CF_PAGES_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://kheirian.pages.dev"
      : "http://localhost:3000"),
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),

  // Kept out of search results while the page still shows placeholders --
  // see src/lib/launch.ts for why, and flip the flag there to go public.
  robots: IS_PUBLIC_LAUNCH
    ? { index: true, follow: true }
    : { index: false, follow: false },
  title: SITE.title,
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    images: [
      {
        // 1200x630 is what the social clients actually crop to; the 3042px
        // source was 2 MB and several clients simply refuse to fetch it.
        url: "/images/og-card.jpg",
        width: 1200,
        height: 630,
        alt: "نمای انفجاری کارتن پنج لایه پسته فلات",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/images/og-card.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="bg-bg text-ink antialiased">
        <SmoothScrollProvider>
          {/* Sits outside the page's skew wrapper: position:fixed elements must
              not have a transformed ancestor. */}
          <CustomCursor />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
