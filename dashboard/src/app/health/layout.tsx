import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health",
  description: "Healthcare infrastructure, maternal and child health indicators, immunization coverage, and nutrition data for West Bengal. Data from NFHS-5 and NHM.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
