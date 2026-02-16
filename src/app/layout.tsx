import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import GradientBackground from "@/components/ui/GradientBackground";
import Navbar from "@/components/ui/Navbar";
import { ToastProvider } from "@/context/ToastContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Bikely Web",
  description: "Premium bicycle rental platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ConvexClientProvider>
          <ToastProvider>
            <GradientBackground />
            <Navbar />
            <main className="flex-1">{children}</main>
          </ToastProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
