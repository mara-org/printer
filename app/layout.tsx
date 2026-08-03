import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PaperLens — Understand any document",
  description:
    "Snap any contract, lease, insurance policy, or medical bill. Get a plain-language explanation in your language, with risks flagged.",
  openGraph: {
    title: "PaperLens — Understand any document",
    description:
      "Plain-language explanations of contracts, leases, insurance, and medical paperwork. In 20+ languages.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
