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

export const metadata: Metadata = {
  title: "خیریان | بسته‌بندی",
  description: "طراحی و تولید جعبه‌های بسته‌بندی ممتاز",
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
