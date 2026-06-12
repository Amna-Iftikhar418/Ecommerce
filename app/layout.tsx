import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { clerkAppearance } from "@/lib/clerkAppearance";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Bella Cucina | Fresh Italian Food Delivered",
    template: "%s | Bella Cucina",
  },
  description:
    "Order handcrafted Italian dishes online from Bella Cucina. Fresh pasta, wood-fired pizza, and more — delivered to your door in under 35 minutes.",
  keywords: ["Italian food", "food delivery", "pasta", "pizza", "restaurant", "Bella Cucina"],
  openGraph: {
    type: "website",
    siteName: "Bella Cucina",
    title: "Bella Cucina | Fresh Italian Food Delivered",
    description:
      "Order handcrafted Italian dishes online from Bella Cucina. Fresh pasta, wood-fired pizza, and more — delivered to your door in under 35 minutes.",
    url: APP_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Bella Cucina | Fresh Italian Food Delivered",
    description:
      "Order handcrafted Italian dishes online from Bella Cucina. Fresh pasta, wood-fired pizza, and more — delivered to your door in under 35 minutes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col">
          {children}
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
