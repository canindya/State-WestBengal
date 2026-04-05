import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education",
  description: "School infrastructure, enrollment by gender, learning outcomes, and pupil-teacher ratios across West Bengal. Data from UDISE+ 2024-25 and ASER 2024.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
