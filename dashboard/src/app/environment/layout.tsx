import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Air Quality",
  description: "AQI monitoring across 10 major West Bengal cities — pollutant breakdown, seasonal patterns, and health advisories. Data from Open-Meteo Air Quality API.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
