import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budget & Finance",
  description: "Revenue, expenditure, sector allocations, fiscal indicators, and debt analysis for West Bengal. Data from PRS India and CAG Audit Reports.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
