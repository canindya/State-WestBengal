import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Geographic Map",
  description: "Interactive district-level choropleth map of West Bengal with NFHS-5 indicators: sex ratio at birth, female literacy, institutional delivery, immunization, and child stunting.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
