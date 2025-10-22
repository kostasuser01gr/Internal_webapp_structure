import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Internal Web App Structure - CarWash Pro",
  description: "Modern PWA web app for vehicle washing management - Goldcar & Europcar",
  manifest: "/manifest.webmanifest",
  themeColor: "#111827",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CarWash Pro",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" />
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
