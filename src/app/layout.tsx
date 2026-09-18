import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import { OraklRouteTransition } from "@/components/transitions/OraklRouteTransition";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orakl",
  description:
    "Prediction games built for competition, connection and bragging rights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} data-product="platform">
        <OraklRouteTransition>
          <main className="min-h-[calc(100svh-4rem)]">{children}</main>
        </OraklRouteTransition>

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
