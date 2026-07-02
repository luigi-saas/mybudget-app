import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import SWRegister from "@/components/SWRegister";

export const metadata: Metadata = {
  title: "Budgetly — Budget & Savings Tracker",
  description:
    "Track fixed charges, variable spending, and savings goals in one clean dashboard. Install it on your phone like an app.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Budgetly",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1CA7EC",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <SWRegister />
      </body>
    </html>
  );
}
