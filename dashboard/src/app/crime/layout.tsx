import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crime & Safety",
  description: "Crime trends, category breakdown, special categories, and district-wise crime rates for West Bengal. Data from NCRB Crime in India 2023.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
