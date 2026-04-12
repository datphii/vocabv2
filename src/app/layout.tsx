import type { Metadata, Viewport } from "next";
import ServiceWorkerRegister from "@/components/layout/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "MechWords — Engineering English Vocabulary",
  description:
    "Learn mechanical engineering English vocabulary through contextual comprehensive learning.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MechWords",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
