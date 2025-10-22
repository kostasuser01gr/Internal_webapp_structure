import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Internal Web App Structure - CarWash Pro",
  description: "Modern PWA web app for vehicle washing management - Goldcar & Europcar",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CarWash Pro",
  },
  applicationName: "CarWash Pro",
  keywords: ["carwash", "vehicle", "management", "pwa", "goldcar", "europcar"],
};

export const viewport: Viewport = {
  themeColor: "#111827",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:rounded">
          Μετάβαση στο περιεχόμενο
        </a>
        <main id="main">
          {children}
        </main>
      </body>
    </html>
  );
}
