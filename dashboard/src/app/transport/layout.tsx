import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transport",
  description: "Road network, vehicle registration trends, EV adoption, public transport, and road accident data for West Bengal. Data from MoRTH and VAHAN.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
