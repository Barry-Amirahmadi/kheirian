import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";

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
};

export const metadata: Metadata = {
  // TODO: swap for the real domain at deploy time. Relative og:image URLs are
  // resolved against this, so social previews break until it is correct.
  metadataBase: new URL("http://localhost:3000"),
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
        url: "/images/products/exploded-view-hq.jpg",
        width: 3042,
        height: 1408,
        alt: "نمای انفجاری کارتن پنج لایه پسته فلات",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/images/products/exploded-view-hq.jpg"],
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
