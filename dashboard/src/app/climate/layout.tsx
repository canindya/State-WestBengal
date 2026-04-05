import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Climate & Environment",
  description: "Rainfall patterns, temperature trends, seasonal distribution, and extreme weather events across West Bengal districts. Data from IMD and Open-Meteo.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
