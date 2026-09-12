import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leash Agent",
  description: "Revocable, scoped authority for autonomous agents.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
