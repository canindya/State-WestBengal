import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ThemeProvider from "@/components/layout/ThemeProvider";
import LanguageProvider from "@/i18n/LanguageProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "West Bengal State Dashboard",
    template: "%s | West Bengal Dashboard",
  },
  description: "Interactive data dashboard for West Bengal — demographics, climate, air quality, health, education, crime, transport, budget, and geographic insights from 30+ open data sources.",
  keywords: ["West Bengal", "dashboard", "open data", "demographics", "climate", "air quality", "health", "education", "crime", "transport", "budget", "India"],
  authors: [{ name: "canindya" }],
  openGraph: {
    title: "West Bengal State Dashboard",
    description: "Interactive data dashboard visualizing open data across 10 domains for West Bengal, India.",
    type: "website",
    locale: "en_IN",
    siteName: "West Bengal State Dashboard",
  },
  twitter: {
    card: "summary_large_image",
    title: "West Bengal State Dashboard",
    description: "Interactive data dashboard visualizing open data across 10 domains for West Bengal, India.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${notoBengali.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
