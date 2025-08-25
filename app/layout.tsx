import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/header";
import LayoutClient from "./layout-client";

export const metadata: Metadata = {
  title: "PinClone - Discover and Save Ideas",
  description:
    "A Pinterest-like platform for discovering and saving creative ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="ligh">
      <body className={`min-h-screen bg-background font-sans`}>
        <Providers>
          <LayoutClient>
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </LayoutClient>
        </Providers>
      </body>
    </html>
  );
}
