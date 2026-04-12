import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsentBanner from "@/components/layout/ConsentBanner";
import ThemeProvider from "@/components/layout/ThemeProvider";
import LanguageProvider from "@/i18n/LanguageProvider";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Google Consent Mode v2 default — denied for everything, with a short wait
// window so an Accept click lands before the first event fires. This runs
// before @next/third-parties loads gtag.js, so GA respects the denied state
// from the first request and only fires cookieless pings until consent.
const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});
`.trim();

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
      <head>
        {GA_ID && (
          <Script
            id="consent-default"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8">
              {children}
            </main>
            <Footer />
            {GA_ID && <ConsentBanner />}
          </LanguageProvider>
        </ThemeProvider>
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
