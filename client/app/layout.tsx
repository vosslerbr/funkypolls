import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import Nav from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "FunkyPolls | Home",
  description: "Create your poll, cast your vote, explore results.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Nav />
          <MobileNav />

          <main className="flex min-h-screen flex-col md:px-8 px-4 py-24 max-w-screen-xl m-auto">
            {children}
          </main>
          <Footer />
          <Toaster />

          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
