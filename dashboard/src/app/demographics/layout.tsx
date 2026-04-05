import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "People & Demographics",
  description: "Population projections, female literacy, child nutrition, household amenities, and vital statistics for West Bengal. Data from NFHS-5, RGI Projections, and SRS.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
